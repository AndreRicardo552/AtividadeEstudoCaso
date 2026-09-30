# 🛡️ GitHub Shield API - Estudo de Caso: Defesa em Profundidade contra Mass Assignment

Projeto prático desenvolvido para a disciplina, abordando a identificação e resolução da vulnerabilidade clássica de **Mass Assignment** (Caso Homakov / GitHub de 2012) transposta para o ambiente moderno de APIs REST com **Node.js, Express, Sequelize (MySQL), JWT e Bcrypt**.

---

## 📋 Requisitos Implementados

1. **Mapeamento e Banco de Dados:** Modelo `User` com Sequelize e MySQL (`src/models/User.js`).
2. **Segurança & Autenticação:** Middleware `verifyToken` (`src/middlewares/verifyToken.js`) protegendo a rota `/api/auth/profile`.
3. **Validação & Tratamento de Dados:** Sanitização e Whitelisting com `express-validator` (`src/validators/authValidator.js`).
4. **Criptografia:** Hashing seguro de senhas com `bcryptjs` através de hooks do Sequelize e validação no login.

---

## 🏛️ Arquitetura do Projeto (MVC + Defesa em Profundidade)

```
EstudoCasoGithub/
├── src/
│   ├── config/
│   │   └── database.js          # Conexão Sequelize com MySQL
│   ├── controllers/
│   │   └── authController.js    # Lógica de registro, login e perfil seguro
│   ├── middlewares/
│   │   └── verifyToken.js       # Validação e integridade do JWT
│   ├── models/
│   │   └── User.js              # Model Sequelize com tipos, hooks e defaults
│   ├── routes/
│   │   └── authRoutes.js        # Mapeamento de endpoints e injeção de middlewares
│   ├── validators/
│   │   └── authValidator.js     # Whitelisting e sanitização (express-validator)
│   └── app.js                   # Configuração dos middlewares globais e rotas Express
├── .env.example                 # Modelo das variáveis de ambiente
├── .env                         # Configurações do ambiente local
├── insomnia_collection.json     # Coleção exportada pronta para importar no Insomnia
├── package.json                 # Dependências e scripts do projeto
└── server.js                    # Bootstrap da aplicação e sincronização do BD
```

---

## 🚀 Como Executar

### 1. Configurar o Banco de Dados
Certifique-se de que o serviço MySQL esteja em execução e crie a base de dados:
```sql
CREATE DATABASE github_shield_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ajuste as credenciais no arquivo `.env` (caso sua senha do MySQL seja diferente de `root`):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=github_shield_db
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=super_secret_jwt_key_homakov_defense_2026
JWT_EXPIRES_IN=1d
```

### 2. Iniciar o Servidor
```bash
npm run dev
# ou
npm start
```

---

## 🧪 Demonstração Prática no Insomnia

Importe o arquivo [`insomnia_collection.json`](./insomnia_collection.json) no Insomnia (*Application -> Preferences/Data -> Import Data -> From File*).

A coleção já vem configurada com os **5 cenários essenciais para a apresentação**:

| # | Requisição | Método | Endpoint | Objetivo da Demonstração |
|---|---|---|---|---|
| **1** | **[Ataque] Registro com Mass Assignment** | `POST` | `/api/auth/register` | Envia `"role": "admin"`. A API intercepta via `matchedData` e `fields`, cadastrando com `role: "user"`. |
| **2** | **[Validação] Registro com Dados Inválidos** | `POST` | `/api/auth/register` | Envia e-mail e senha inválidos. Retorna `400 Bad Request` com a lista de erros do `express-validator`. |
| **3** | **[Autenticação] Login com Sucesso** | `POST` | `/api/auth/login` | Compara hash bcrypt e gera o token JWT assinado. |
| **4** | **[Segurança] Acesso Sem Token** | `GET` | `/api/auth/profile` | Tenta acessar rota restrita sem header `Authorization`. Retorna `401 Unauthorized`. |
| **5** | **[Segurança] Acesso Com Token JWT** | `GET` | `/api/auth/profile` | Envia `Bearer <token>` no header. Retorna `200 OK` e os dados do usuário autenticado. |
