const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
<<<<<<< HEAD
  nome: { type: String, required: [true, 'Nome é obrigatório'] },
  email: { type: String, required: [true, 'E-mail é obrigatório'], unique: true },
  senha: { type: String, required: [true, 'Senha é obrigatória'] },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
=======
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
>>>>>>> 12cdc09d52172f7f40b4ffeabe85f8b2e8b3ce4a
