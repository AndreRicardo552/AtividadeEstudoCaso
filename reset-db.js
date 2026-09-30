require('dotenv').config();
const sequelize = require('./src/config/database');
const User = require('./src/models/User');

async function resetDatabase() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();

    console.log('🧹 Limpando todos os dados da tabela de usuários...');
    // Truncate limpa a tabela e reinicia os IDs auto-increment
    await User.destroy({ where: {}, truncate: true, cascade: true });

    console.log('✨ Banco de dados limpo com sucesso! Pronto para novos testes.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao limpar o banco de dados:', error.message);
    process.exit(1);
  }
}

resetDatabase();
