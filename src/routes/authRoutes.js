const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');
const verifyToken = require('../middlewares/verifyToken');

// Rotas públicas com validação e sanitização
router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);

// Rota protegida por autenticação JWT
router.get('/profile', verifyToken, authController.getProfile);

// Rota utilitária para testes/apresentações: limpa a base de usuários
router.post('/reset', authController.resetDatabase);

module.exports = router;
