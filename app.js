const { conectar, desconectar } = require('./database/connection');
const Usuario = require('./models/Usuario');
const Categoria = require('./models/Categoria');
const VideoService = require('./services/VideoService');

async function main() {
  await conectar();

  let usuario = await Usuario.findOne({ email: 'joao@email.com' });
  if (!usuario) {
    usuario = await Usuario.create({ nome: 'Joao Silva', email: 'joao@email.com' });
  }

  let categoria = await Categoria.findOne({ nome: 'Tecnologia' });
  if (!categoria) {
    categoria = await Categoria.create({
      nome: 'Tecnologia',
      descricao: 'Videos sobre programacao e tech',
    });
  }

  const v1 = await VideoService.criarVideo({
    titulo: 'Introducao ao Node.js',
    descricao: 'Aprenda Node.js do zero com exemplos praticos.',
    usuarioId: usuario._id,
    categoriaId: categoria._id,
  });

  const v2 = await VideoService.criarVideo({
    titulo: 'MongoDB com Mongoose',
    descricao: 'Como usar Mongoose para modelar dados no MongoDB.',
    usuarioId: usuario._id,
    categoriaId: categoria._id,
  });

  await VideoService.listarVideos();

  await VideoService.buscarPorTitulo('node');

  await VideoService.deletarVideo(v2._id);

  await VideoService.listarVideos();

  await desconectar();
}

main().catch(err => {
  const { logError } = require('./utils/logger');
  logError('Erro nao tratado em main()', err);
  process.exit(1);
});