const fs   = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'error.log');

function logError(mensagem, erro) {
  const data    = new Date().toISOString();
  const detalhe = erro ? erro.message || String(erro) : '';
  const linha   = `[${data}] ${mensagem}${detalhe ? ' | ' + detalhe : ''}\n`;

  fs.appendFile(LOG_FILE, linha, (err) => {
    if (err) console.error('Falha ao gravar log:', err.message);
  });

  console.error(linha.trim());
}

module.exports = { logError };