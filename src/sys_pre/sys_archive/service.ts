import { Context } from 'koa';
import COL, { CLmodel } from './schema';
import { parseQuery } from '@src/utils/system/parse/parseQuery';
import { parseDoc } from '@src/utils/system/parse/parseDoc';

export const list = async (ctx: Context) => {
    const { request } = ctx;
    try {
        const { page, pageSize, query, select, skip, limit, populates, sort } = parseQuery(request.query, CLmodel);

        const total = await COL.countDocuments(query);
        const items = await COL.find(query)
            .select(select)
            .populate(populates)
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
}

export const deleteMany = async (ctx: Context) => {
    const { request } = ctx;
    try {
        const forceLimitValue = request.query.forceLimit;
        delete request.query.forceLimit;
        let limit: number = 60;
        if (typeof forceLimitValue === 'string' || typeof forceLimitValue === 'number') {
            limit = Number(forceLimitValue);
        }

        const { query } = parseQuery(request.query, CLmodel);

        const total = await COL.countDocuments(query);
        if (total > limit) throw ({ message: `【避免误操作】一次性删除 ${total} 个文件太多了, 如真有需求 请在query上加 forceLimit 数字参数作为删除条目极限 现在为${forceLimitValue}条` });
        const items = await COL.find(query);
        await COL.deleteMany(query);
        const status = 200;
        ctx.status = status;
        return ctx.body = { status, data: { message: "永久删除了以下的所有归档数据", items } };
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        const status = 500;
        ctx.status = status;
        return ctx.body = { status, message: "批量删除失败 - " + (e as Error).message };
    }
}




export const detail = async (ctx: Context) => {
    const { request } = ctx;
    try {
        const { query, select, populates } = parseQuery(request.query, CLmodel);

        const item = await COL.findOne(query)
            .select(select)
            .populate(populates)

        const status = 200;
        ctx.status = status;
        return ctx.body = { status, data: { item } };
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        const status = 500;
        ctx.status = status;
        return ctx.body = { status, message: "查看详情失败 - " + (e as Error).message };
    }
}

export const deleteOne = async (ctx: Context) => {
    const { request } = ctx;
    try {
        const { query } = parseQuery(request.query, CLmodel);

        const item = await COL.findOne(query);
        if (!item) throw ({ message: '没有找到此归档数据' });
        await COL.deleteOne({ _id: item._id });

        const status = 200;
        ctx.status = status;
        return ctx.body = { status, data: { message: '永久删除归档数据', item } };
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        const status = 500;
        ctx.status = status;
        return ctx.body = { status, message: "删除失败 - " + (e as Error).message };
    }
}


export const save = async (ctx: Context) => {
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
        return ctx.body = { status, message: "保存失败 - " + (e as Error).message };
    }
}

export const saveMany = async (ctx: Context) => {
    const { request, payload } = ctx;
    try {
        const docs = request.body.docs;
        if (!(docs instanceof Array)) throw ({ message: "需要 body.docs 数组对象参数" });
        const _docs = [];
        for (const doc of docs) {
            parseDoc(doc, CLmodel, payload);
            const _doc = new COL(doc);
            _docs.push(_doc);
        }
        const items = await COL.insertMany(_docs);

        const status = 200;
        ctx.status = status;
        return ctx.body = { status, data: { items } };
    } catch (e) {
        console.error(request.url + ' create: ' + e);
        const status = 500;
        ctx.status = status;
        return ctx.body = { status, message: "保存失败 - " + (e as Error).message };
    }
}