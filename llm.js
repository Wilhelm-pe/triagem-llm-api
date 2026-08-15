require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

async function classifyTicket(ticketText) {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          'Você é um sistema de triagem de tickets de suporte. Analise o texto do ticket e responda APENAS com um JSON no formato: {"categoria": "bug|duvida|solicitacao|reclamacao", "urgencia": "baixa|media|alta"}. Não escreva mais nada além do JSON.',
      },
      {
        role: "user",
        content: ticketText,
      },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = classifyTicket;
