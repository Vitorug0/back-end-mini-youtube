const express = require('express');
const session = require('express-session');
const { conectar } = require('./database/connection');

const authRoutes = require('./routes/auth');
const videosRoutes = require('./routes/videos');
const categoriasRoutes = require('./routes/categorias');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessões
app.use(session({
  secret: 'youtube_basico_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 horas
    httpOnly: true,
  },
}));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API YouTube Básico — Projeto 2',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Cadastrar novo usuário',
        'POST /api/auth/login': 'Fazer login',
        'POST /api/auth/logout': 'Fazer logout',
      },
      videos: {
        'GET /api/videos': 'Listar todos os vídeos (requer login)',
        'GET /api/videos/buscar?titulo=...': 'Buscar vídeos por título (requer login)',
        'GET /api/videos/:id': 'Buscar vídeo por ID (requer login)',
        'POST /api/videos': 'Criar vídeo (requer login)',
        'PUT /api/videos/:id': 'Atualizar vídeo (requer login, apenas o dono)',
        'DELETE /api/videos/:id': 'Excluir vídeo (requer login, apenas o dono)',
      },
      categorias: {
        'GET /api/categorias': 'Listar categorias (requer login)',
        'GET /api/categorias/:id': 'Buscar categoria por ID (requer login)',
        'POST /api/categorias': 'Criar categoria (requer login)',
        'DELETE /api/categorias/:id': 'Excluir categoria (requer login)',
      },
      usuarios: {
        'GET /api/usuarios': 'Listar usuários (requer login)',
        'GET /api/usuarios/me': 'Dados do usuário logado (requer login)',
        'GET /api/usuarios/me/videos': 'Vídeos do usuário logado (requer login)',
      },
    },
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Inicialização do servidor
async function iniciar() {
  await conectar();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciar().catch((erro) => {
  console.error('Erro ao iniciar servidor:', erro);
  process.exit(1);
});
