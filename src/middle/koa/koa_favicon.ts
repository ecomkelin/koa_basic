import { Context } from 'koa';

export default async (ctx: Context, next: Function) => {
    if (ctx.path === '/favicon.ico') {
        ctx.status = 204; // 204 No Content
        return;
    }
    await next();
}