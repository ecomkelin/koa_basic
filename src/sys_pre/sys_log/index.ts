import Router from 'koa-router';
import { Context } from 'koa';
import COL, { CLmodel } from './schema';
import { parseQuery } from '@src/utils/system/parse/parseQuery';
import { parseDoc } from '@src/utils/system/parse/parseDoc';

export default function router_log(router: Router) {
    router.get('/sys_log/list', async (ctx: Context) => {
        const { request } = ctx;
        try {
            const { page, pageSize, query, select, skip, limit, populates, sort } = parseQuery(request.query, CLmodel);

            const total = await COL.countDocuments(query);
            const items = await COL.find(query)
                .populate(populates)
                .select(select)
                .skip(skip).limit(limit).sort(sort)

            const status = 200;
            ctx.status = status;
            return ctx.body = { status, data: { total, page, pageSize, items } };
        } catch (e) {
            console.error(request.url + ' list: ' + e);
            const status = 500;
            ctx.status = status;
            return ctx.body = { status, message: "列表获取失败 - " + (e as Error).message };
        }
    });

    router.post('/sys_log/create', async (ctx: Context) => {
        const { request, payload } = ctx;
        try {
            const doc = request.body;
            parseDoc(doc, CLmodel, payload);

            const _doc = new COL(doc);
            const item = await _doc.save();

            const status = 200;
            ctx.status = status;
            return ctx.body = { status, data: { item } };
        } catch (e) {
            console.error(request.url + ' create: ' + e);
            const status = 500;
            ctx.status = status;
            return ctx.body = { status, message: "日志保存失败 - " + (e as Error).message };
        }
    });
}