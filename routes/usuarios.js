const express = require('express');
const Usuario = require('../models/Usuario');
const Video = require('../models/Video');
const { verificarSessao } = require('../middleware/auth');
const router = express.Router();

// Todas as rotas de usuário exigem sessão ativa
router.use(verificarSessao);

// GET /api/usuarios/me — retorna os dados do usuário logado
router.get('/me', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.usuarioId).select('-senha');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao buscar dados do usuário.' });
  }
});

// GET /api/usuarios/me/videos — lista os vídeos do usuário logado
router.get('/me/videos', async (req, res) => {
  try {
    const videos = await Video.find({ usuarioId: req.session.usuarioId })
      .populate('categoriaId', 'nome')
      .sort({ dataUpload: -1 });

    return res.status(200).json({ total: videos.length, videos });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao listar vídeos do usuário.' });
  }
});

// GET /api/usuarios — lista todos os usuários (sem senha)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha').sort({ nome: 1 });
    return res.status(200).json({ total: usuarios.length, usuarios });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
});

module.exports = router;
