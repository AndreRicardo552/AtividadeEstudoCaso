const { body, validationResult, matchedData } = require('express-validator');

/**
 * Middleware para capturar erros de validação e aplicar Whitelisting
 * descarta qualquer campo extra injetado maliciosamente (ex: role, is_admin)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erros de validação encontrados nos dados fornecidos.',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  // WHITELISTING CRÍTICO (Defesa contra Mass Assignment / Caso Homakov):
  // matchedData extrai SOMENTE os campos validados e descarta qualquer parâmetro excedente do req.body
  req.safeBody = matchedData(req, { locations: ['body'] });
  next();
};

// Regras de validação para registro de novos usuários
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('O nome é obrigatório.')
    .isLength({ min: 2, max: 100 }).withMessage('O nome deve conter entre 2 e 100 caracteres.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um endereço de e-mail válido.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('A senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
];

// Regras de validação para login
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um e-mail válido.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('A senha é obrigatória.')
];

module.exports = {
  registerRules: [...registerRules, validate],
  loginRules: [...loginRules, validate]
};
