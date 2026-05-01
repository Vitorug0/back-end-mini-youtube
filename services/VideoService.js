const Video = require('../models/Video');
const { logError } = require('../utils/logger');

async function criarVideo({ titulo, descricao, usuarioId, categoriaId }) {
  try {
    const video = new Video({ titulo, descricao, usuarioId, categoriaId });
    await video.save();
    console.log('Video criado:', video.titulo);
    return video;
  } catch (erro) {
    logError('Erro ao criar video', erro);
    throw erro;
  }
}

async function buscarPorTitulo(termo) {
  try {
    const videos = await Video.find({ titulo: { $regex: termo, $options: 'i' } })
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome');
    console.log(`Busca por "${termo}": ${videos.length} resultado(s)`);
    return videos;
  } catch (erro) {
    logError('Erro ao buscar videos por titulo', erro);
    throw erro;
  }
}

async function listarVideos() {
  try {
    const videos = await Video.find()
      .populate('usuarioId', 'nome email')
      .populate('categoriaId', 'nome')
      .sort({ dataUpload: -1 });
    console.log('Total de videos:', videos.length);
    return videos;
  } catch (erro) {
    logError('Erro ao listar videos', erro);
    throw erro;
  }
}

async function deletarVideo(id) {
  try {
    const resultado = await Video.findByIdAndDelete(id);
    if (!resultado) {
      console.warn('Video nao encontrado:', id);
      return null;
    }
    console.log('Video deletado:', resultado.titulo);
    return resultado;
  } catch (erro) {
    logError('Erro ao deletar video', erro);
    throw erro;
  }
}

module.exports = { criarVideo, buscarPorTitulo, listarVideos, deletarVideo };