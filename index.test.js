const app = require("./index");
const supertest = require('supertest');
const pool = require('./db')





test('testando a rota /', async () => {
    const result = await supertest(app).get('/');
    expect(result.status).toBe(200);

});

test('servidor ativo /db_check', async() => {
    const resultDb = await supertest(app).get('/db-check');
    expect(resultDb.status).toBe(200);

});

afterAll(async () => {
    await pool.end()
});