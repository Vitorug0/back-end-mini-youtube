const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  descricao: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);