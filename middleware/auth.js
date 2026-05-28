function verificarSessao(req, res, next) {
  if (!req.session || !req.session.usuarioId) {
    return res.status(401).json({ erro: 'Acesso negado. Faça login para continuar.' });
  }
  next();
}

module.exports = { verificarSessao };
