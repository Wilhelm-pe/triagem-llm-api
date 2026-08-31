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
    // PASSO 1: configura o mock ANTES de tudo
    classifyTicket.mockResolvedValue('{"categoria": "bug", "urgencia": "alta"}');

    // PASSO 2: dispara a requisição com await, e manda o corpo com .send()
    const resultApi = await supertest(app).post('/classify').send({ ticketText: "teste" });

    // PASSO 3: confere o resultado
    expect(resultApi.body.categoria).toBe("bug");
});

afterAll(async () => {
    await pool.end()
});