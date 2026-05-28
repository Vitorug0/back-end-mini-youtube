const express = require('express');
const Usuario = require('../models/Usuario');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação de campos obrigatórios
  const erros = [];
  if (!nome || nome.trim() === '') erros.push('Nome é obrigatório.');
  if (!email || email.trim() === '') erros.push('E-mail é obrigatório.');
  if (!senha || senha.trim() === '') erros.push('Senha é obrigatória.');
  if (senha && senha.length < 6) erros.push('Senha deve ter no mínimo 6 caracteres.');

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ erros: ['E-mail já cadastrado.'] });
    }

    const usuario = await Usuario.create({ nome, email, senha });

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
    });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Validação de campos obrigatórios
  const erros = [];
  if (!email || email.trim() === '') erros.push('E-mail é obrigatório.');
  if (!senha || senha.trim() === '') erros.push('Senha é obrigatória.');

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erros: ['E-mail ou senha inválidos.'] });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ erros: ['E-mail ou senha inválidos.'] });
    }

    req.session.usuarioId = usuario._id;
    req.session.usuarioNome = usuario.nome;

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
    });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro interno ao realizar login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      return res.status(500).json({ erro: 'Erro ao encerrar sessão.' });
    }
    return res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
  });
});

module.exports = router;
