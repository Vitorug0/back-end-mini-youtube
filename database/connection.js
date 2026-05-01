const mongoose = require('mongoose');
const { logError } = require('../utils/logger');

const MONGO_URI = 'mongodb://localhost:27017/youtube_basico';

async function conectar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB:', MONGO_URI);
  } catch (erro) {
    logError('Falha ao conectar no MongoDB', erro);
    process.exit(1);
  }
}

async function desconectar() {
  await mongoose.disconnect();
  console.log('Desconectado do MongoDB.');
}

module.exports = { conectar, desconectar };