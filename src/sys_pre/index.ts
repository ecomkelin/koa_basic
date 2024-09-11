import Koa, { Context } from 'koa';
import Router from 'koa-router';
import router_log from './sys_log';
import router_archive from './sys_archive';
const router = new Router();

export default function sys_pre(app: Koa) {
    router_log(router);
    router_archive(router);
    app.use(router.routes());
}