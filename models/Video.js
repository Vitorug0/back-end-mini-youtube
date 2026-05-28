const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  titulo: { type: String, required: [true, 'Titulo e obrigatorio'] },
  descricao: { type: String, required: [true, 'Descricao e obrigatoria'] },
  dataUpload: { type: Date, default: Date.now },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
});

module.exports = mongoose.model('Video', videoSchema);