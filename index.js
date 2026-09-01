const express = require("express");
const pool = require("./db");
const classifyTicket = require("./llm");
const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "API de triagem funcionando!" });
});

app.get("/db-check", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "Conectado ao banco!", timestamp: result.rows[0].now });
  } catch (err) {
    next(err);
  }
});

app.post("/classify", async (req, res, next) => {
  try {
    const { ticketText } = req.body;
    if (!ticketText) {
      return res.status(400).json({ message: "Valor vazio" });
    }
    const result = await classifyTicket(ticketText);
    const resultObject = JSON.parse(result);

    res.json(resultObject);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err); // loga o erro completo no servidor
  res.status(500).json({ message: "Erro ao processar a requisição" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
