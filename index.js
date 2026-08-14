const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API de triagem funcionando!' });
});

app.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Conectado ao banco!', timestamp: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'Erro na conexão', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});