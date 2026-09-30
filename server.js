require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // Autenticação e sincronização do modelo com o banco de dados MySQL
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');

    // Cria a tabela se não existir
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Endpoint base: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('❌ Falha ao conectar ou sincronizar o banco de dados:', error.message);
    console.error('⚠️  Certifique-se de que o MySQL está rodando e o banco especificado no .env existe.');
    process.exit(1);
  }
}

bootstrap();
