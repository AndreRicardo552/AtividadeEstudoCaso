const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Registro de novo usuário com Defesa em Profundidade contra Mass Assignment
const register = async (req, res) => {
  try {
    // 1ª Linha de Defesa: req.safeBody fornecido pelo express-validator (apenas name, email, password)
    const { name, email, password } = req.safeBody;

    // Verificar se o e-mail já está cadastrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Este e-mail já está cadastrado no sistema.'
      });
    }

    // 2ª Linha de Defesa (Sequelize fields allowlist):
    // Mesmo que alguém passasse dados extras, o Sequelize só persiste os atributos declarados em 'fields'
    const newUser = await User.create(
      { name, email, password },
      { fields: ['name', 'email', 'password'] }
    );

    return res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role, // Comprovante na demonstração: será sempre 'user'
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Erro no registro de usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao registrar usuário.'
    });
  }
};

// Login do usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.safeBody;

    // Buscar usuário pelo e-mail
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // Comparar senha com o hash bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // Gerar token JWT com payload seguro
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao realizar login.'
    });
  }
};

// Obtenção do perfil do usuário autenticado (Rota protegida por JWT)
const getProfile = async (req, res) => {
  try {
    // req.user foi injetado com sucesso pelo middleware verifyToken
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Perfil obtido com sucesso.',
      user
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar perfil.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
