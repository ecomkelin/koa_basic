import Router from 'koa-router';
import { Context } from 'koa';

import { generateToken } from '@src/utils/crypto/jwt';

const tt = () => {
    // throw new Error("hello error tt")
    throw ({ message: "hello error tt" })
}
export default function router_test(router: Router) {
    router.get('/test', async (ctx: Context) => {
        try {
            const { query } = ctx.request;
            console.log(111, query);
            return ctx.body = { status: 200, query }
        } catch (e) {
            return ctx.body = { status: 500, data: { message: (e as any).message } }
        }
    });

    router.get('/user/:id', async (ctx: Context) => {
        const { params, payload } = ctx;
        return ctx.body = { status: 200, data: { payload, params } };
    });

    router.get('/token', async (ctx: Context) => {
        const { query } = ctx.request;
        const payload = Object.keys(query).length > 0 ? query : { _id: '66b86b2fe929c4ea64c6869c' }
        const token = generateToken({ _id: '66b86b2fe929c4ea64c6869c' });
        return ctx.body = { status: 200, data: { token, payload } };
    });
}