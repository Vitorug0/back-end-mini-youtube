const express = require('express');
const Video = require('../models/Video');
const Categoria = require('../models/Categoria');
const { verificarSessao } = require('../middleware/auth');
const router = express.Router();

// Todas as rotas de vídeo exigem sessão ativa
router.use(verificarSessao);

// GET /api/videos — lista todos os vídeos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome')
      .sort({ dataUpload: -1 });

    return res.status(200).json({ total: videos.length, videos });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao listar vídeos.' });
  }
});

// GET /api/videos/buscar?titulo=... — busca vídeos por título
router.get('/buscar', async (req, res) => {
  const { titulo } = req.query;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ erros: ['Parâmetro "titulo" é obrigatório para a busca.'] });
  }

  try {
    const videos = await Video.find({ titulo: { $regex: titulo, $options: 'i' } })
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome');

    return res.status(200).json({ total: videos.length, videos });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao buscar vídeos.' });
  }
});

// GET /api/videos/:id — retorna um vídeo específico
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome');

    if (!video) {
      return res.status(404).json({ erro: 'Vídeo não encontrado.' });
    }

    return res.status(200).json(video);
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID de vídeo inválido.' });
    }
    return res.status(500).json({ erro: 'Erro ao buscar vídeo.' });
  }
});

// POST /api/videos — cria um novo vídeo
router.post('/', async (req, res) => {
  const { titulo, descricao, categoriaId } = req.body;

  // Validação de campos obrigatórios
  const erros = [];
  if (!titulo || titulo.trim() === '') erros.push('Título é obrigatório.');
  if (!descricao || descricao.trim() === '') erros.push('Descrição é obrigatória.');
  if (!categoriaId || categoriaId.trim() === '') erros.push('Categoria é obrigatória.');

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const categoriaExiste = await Categoria.findById(categoriaId);
    if (!categoriaExiste) {
      return res.status(400).json({ erros: ['Categoria não encontrada.'] });
    }

    const video = await Video.create({
      titulo,
      descricao,
      usuarioId: req.session.usuarioId,
      categoriaId,
    });

    const videoPopulado = await Video.findById(video._id)
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome');

    return res.status(201).json({ mensagem: 'Vídeo criado com sucesso.', video: videoPopulado });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao criar vídeo.' });
  }
});

// PUT /api/videos/:id — atualiza um vídeo
router.put('/:id', async (req, res) => {
  const { titulo, descricao, categoriaId } = req.body;

  // Validação: ao menos um campo deve ser fornecido
  if (!titulo && !descricao && !categoriaId) {
    return res.status(400).json({ erros: ['Informe ao menos um campo para atualizar (titulo, descricao, categoriaId).'] });
  }

  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ erro: 'Vídeo não encontrado.' });
    }

    // Apenas o dono do vídeo pode editar
    if (String(video.usuarioId) !== String(req.session.usuarioId)) {
      return res.status(403).json({ erro: 'Você não tem permissão para editar este vídeo.' });
    }

    if (categoriaId) {
      const categoriaExiste = await Categoria.findById(categoriaId);
      if (!categoriaExiste) {
        return res.status(400).json({ erros: ['Categoria não encontrada.'] });
      }
    }

    const campos = {};
    if (titulo) campos.titulo = titulo;
    if (descricao) campos.descricao = descricao;
    if (categoriaId) campos.categoriaId = categoriaId;

    const videoAtualizado = await Video.findByIdAndUpdate(req.params.id, campos, { new: true, runValidators: true })
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome');

    return res.status(200).json({ mensagem: 'Vídeo atualizado com sucesso.', video: videoAtualizado });
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID de vídeo inválido.' });
    }
    return res.status(500).json({ erro: 'Erro ao atualizar vídeo.' });
  }
});

// DELETE /api/videos/:id — remove um vídeo
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ erro: 'Vídeo não encontrado.' });
    }

    // Apenas o dono do vídeo pode deletar
    if (String(video.usuarioId) !== String(req.session.usuarioId)) {
      return res.status(403).json({ erro: 'Você não tem permissão para excluir este vídeo.' });
    }

    await Video.findByIdAndDelete(req.params.id);
    return res.status(200).json({ mensagem: 'Vídeo excluído com sucesso.' });
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID de vídeo inválido.' });
    }
    return res.status(500).json({ erro: 'Erro ao excluir vídeo.' });
  }
});

module.exports = router;
