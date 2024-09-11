import request from 'supertest';
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
    ctx.body = 'Hello, TypeScript with Koa!';
});

describe('GET /', () => {
    it('should return Hello, TypeScript with Koa!', async () => {
        const response = await request(app.callback()).get('/');
        expect(response.text).toBe('Hello, TypeScript with Koa!');
        expect(response.status).toBe(200);
    });
});
