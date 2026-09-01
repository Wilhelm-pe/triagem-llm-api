const app = require("./index");
const supertest = require('supertest');
const pool = require('./db');
jest.mock('./llm');
const classifyTicket = require('./llm');





test('testando a rota /', async () => {
    const result = await supertest(app).get('/');
    expect(result.status).toBe(200);

});

test('servidor ativo /db_check', async() => {
    const resultDb = await supertest(app).get('/db-check');
    expect(resultDb.status).toBe(200);

});

test('Testando classificação do ticket', async () => {
    classifyTicket.mockResolvedValue('{"categoria": "bug", "urgencia": "alta"}');
    const resultApi = await supertest(app).post('/classify').send({ ticketText: "teste"});
    
    expect(resultApi.body.categoria).toBe("bug");
});


test('Testando valor vazio para ticket', async () => {
    
    const resultApi = await supertest(app).post('/classify').send({ ticketText: ""});
    expect(resultApi.status).toBe(400);
    
    
});

test('Testando erro na API', async () => {
    // PASSO 1: configura o mock para REJEITAR (não resolver)
    classifyTicket.mockRejectedValue(new Error("Erro ao processar a requisição"));

    // PASSO 2: dispara a requisição
    const resultApi = await supertest(app).post('/classify').send({ ticketText: "teste" });

    // PASSO 3: confere o status e a mensagem de erro
    expect(resultApi.status).toBe(500);
    expect(resultApi.body.message).toBe("Erro ao processar a requisição");
});
afterAll(async () => {
    await pool.end()
});