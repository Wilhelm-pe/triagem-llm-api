const express = require('express');
const pool = require('./db');
const classifyTicket = require('./llm');
const app = express();
app.use(express.json());
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

app.post('/classify', async (req, res) => {
  try {
    const { ticketText } = req.body;
    const result = await classifyTicket(ticketText);
    const resultObject = JSON.parse(result);
    res.json( resultObject );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Não foi possível processar a classificação. Tente novamente" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});