const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz para conferência de status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'Github API - Defesa em Profundidade contra Mass Assignment',
    timestamp: new Date().toISOString()
  });
});

// Injeção dos endpoints da API
app.use('/api/auth', authRoutes);

// Middleware para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.'
  });
});

// Middleware global de tratamento de exceções
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Ocorreu um erro inesperado no servidor.'
  });
});

module.exports = app;
