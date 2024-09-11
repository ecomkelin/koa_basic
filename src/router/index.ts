/**
 * @description: 总路由文件
 * @author: kelin
*/

import Router from 'koa-router';
import router_test from './test';
import router_auto from './auto';

import { TypeRouter } from '../utils/interface/type'
import { Context } from 'koa';

const router = new Router();

const routers: TypeRouter[] = [];  // 为了展示所有路由 不加const使其成为 global变量

/** 首页 测试路由 */
router.get('/', async (ctx: Context) => ctx.body = '访问 /routers');
router_test(router);

/** =====  其他 正常 路由加载  ===== */


// 自动加载路由
router_auto(router, routers);


/** 查看所有路由 一定放在最后 */
router.get('/routers', ctx => {
    const { query } = ctx.request;
    const { path, method, label } = query;
    const data: { [key: string]: TypeRouter } = {}
    routers.forEach((item) => {
        let match = true;
        if (method && item.method !== method) match = false;
        if (path && !item.path.includes(path as string)) match = false;
        if (label && !item.label.includes(label as string)) match = false;
        if (match) data[item.path] = item;
    })
    ctx.body = { data }
});
export default router;