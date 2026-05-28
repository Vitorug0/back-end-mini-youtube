const express = require('express');
const Categoria = require('../models/Categoria');
const { verificarSessao } = require('../middleware/auth');
const router = express.Router();

// Todas as rotas de categoria exigem sessão ativa
router.use(verificarSessao);

// GET /api/categorias — lista todas as categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nome: 1 });
    return res.status(200).json({ total: categorias.length, categorias });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao listar categorias.' });
  }
});

// GET /api/categorias/:id — retorna uma categoria específica
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }
    return res.status(200).json(categoria);
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID de categoria inválido.' });
    }
    return res.status(500).json({ erro: 'Erro ao buscar categoria.' });
  }
});

// POST /api/categorias — cria uma nova categoria
router.post('/', async (req, res) => {
  const { nome, descricao } = req.body;

  // Validação de campos obrigatórios
  const erros = [];
  if (!nome || nome.trim() === '') erros.push('Nome da categoria é obrigatório.');

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const categoriaExistente = await Categoria.findOne({ nome });
    if (categoriaExistente) {
      return res.status(400).json({ erros: ['Já existe uma categoria com este nome.'] });
    }

    const categoria = await Categoria.create({ nome, descricao });
    return res.status(201).json({ mensagem: 'Categoria criada com sucesso.', categoria });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao criar categoria.' });
  }
});

// DELETE /api/categorias/:id — remove uma categoria
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }
    return res.status(200).json({ mensagem: 'Categoria excluída com sucesso.' });
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'ID de categoria inválido.' });
    }
    return res.status(500).json({ erro: 'Erro ao excluir categoria.' });
  }
});

module.exports = router;
