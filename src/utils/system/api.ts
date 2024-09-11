import { Context } from 'koa';
import { Model } from 'mongoose';
import axios from 'axios';
import { parseQuery } from './parse/parseQuery'
import { parseDoc } from './parse/parseDoc';
import { parseSet } from './parse/parseSet';
import { save_logMiddle } from '../sys_log';
import { Success, Exception } from './res';


export const res_list = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request } = ctx;
    try {
        const { page, pageSize, query, select, skip, limit, populates, sort } = parseQuery(request.query, CLmodel);
        // if (populates.length === 0) populates.push({ path: "_id" })
        save_logMiddle({ ctx, log: { query, populates, skip, limit, sort } });
        const total = await COL.countDocuments(query);
        const items = await COL.find(query)
            .select(select)
            .populate(populates)
            .skip(skip).limit(limit).sort(sort)
        return Success(ctx, { total, page, pageSize, items });
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        return Exception(ctx, e);
    }
}


export const res_find = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request } = ctx;
    try {
        const { query, select, skip, limit, populates, sort } = parseQuery(request.query, CLmodel);
        // if (populates.length === 0) populates.push({ path: "_id" })
        save_logMiddle({ ctx, log: { query, populates, skip, limit, sort } });
        const items = await COL.find(query)
            .select(select)
            .populate(populates)
            .skip(skip).limit(limit).sort(sort)
        return Success(ctx, { items })
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        return Exception(ctx, e);
    }
}


export const res_detail = async (ctx: Context, COL: Model<unknown>, CLmodel: Object, options?: { data?: any }) => {
    const { request, params } = ctx;
    const { data = {} } = options || {};
    try {
        const _id: string = params._id;
        const {
            // query,
            select,
            populates
        } = parseQuery(request.query, CLmodel);

        const item = await COL.findOne({ _id })
            .select(select)
            .populate(populates);
        if (!item) throw ({ message: '找不到相应的item数据' });
        return Success(ctx, { item, ...data });
    } catch (e) {
        console.error(request.url + ' detail: ' + e);
        return Exception(ctx, e);
    }
}


export const res_save = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request, payload } = ctx;
    try {
        const doc = request.body;
        parseDoc(doc, CLmodel, payload);

        const _doc = new COL(doc);
        const item = await _doc.save();
        return Success(ctx, { item });
    } catch (e) {
        console.error(request.url + ' save: ' + e);
        return Exception(ctx, e);
    }
}


export const res_saveMany = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request, payload } = ctx;
    try {
        const { docs } = request.body;
        if (!docs) throw new Error("请传递 docs 参数");
        if (!(docs instanceof Array)) throw new Error("docs 必须是数组");
        if (docs.length > Number(process.env.MAX_EVERY_SAVE)) throw ({ message: `您保存的条目数 超过了 env.MAX_EVERY_SAVE ${process.env.MAX_EVERY_SAVE}` });
        const items: Object[] = [];
        for (const doc of docs) {
            parseDoc(doc, CLmodel, payload);
            const _doc = new COL(doc);
            const item = await _doc.save();
            items.push(item);
        }
        return Success(ctx, { items });
    } catch (e) {
        console.error(request.url + ' save: ' + e);
        return Exception(ctx, e);
    }
}

export const res_set = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request, params } = ctx;
    try {
        const _id: string = params._id;
        const { set } = parseSet(ctx, CLmodel);
        const item = await COL.findOne({ _id });
        Object.assign(item, set);
        await item.save();
        return Success(ctx, { item });
    } catch (e) {
        console.error(request.url + ' save: ' + e);
        return Exception(ctx, e);
    }
}


export const res_setMany = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request } = ctx;
    try {
        const { query, set } = parseSet(ctx, CLmodel);
        const items = await COL.find(query);
        if (items.length > Number(process.env.MAX_EVERY_SAVE)) throw ({ message: `您更新的条目数 超过了 env.MAX_EVERY_SAVE ${process.env.MAX_EVERY_SAVE}` });

        for (const item of items) {
            Object.assign(item, set);
            await item.save();
        }
        return Success(ctx, { items });
    } catch (e) {
        console.error(request.url + ' save: ' + e);
        return Exception(ctx, e);
    }
}


export const res_delete = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request, params } = ctx;
    try {
        const _id: string = params.id;

        const item = await COL.findOne({ _id });
        if (!item) throw ({ message: '找不到相应的item数据' });
        await COL.deleteOne({ _id });
        return Success(ctx, { item }, { message: '删除成功' });
    } catch (e) {
        console.error(request.url + ' detail: ' + e);
        return Exception(ctx, e);
    }
}

export const res_deleteMany = async (ctx: Context, COL: Model<unknown>, CLmodel: Object) => {
    const { request } = ctx;
    try {
        const { query } = parseQuery(request.query, CLmodel);
        save_logMiddle({ ctx, log: { query } });
        const items = await COL.find(query);
        if (items.length > Number(process.env.MAX_DELETE)) throw ({ message: `您删除的条目数 超过了 env.MAX_DELETE ${process.env.MAX_DELETE}` });
        const result = await COL.deleteMany(query);
        return Success(ctx, { result, items })
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        return Exception(ctx, e);
    }
}



export const res_archive = async (ctx: Context, COL: Model<unknown>, CLmodel: Object, CLname: string) => {
    const { request, params, payload } = ctx;
    try {
        const _id: string = params.id;

        const item = await COL.findOne({ _id })
        if (!item) throw ({ message: '找不到相应的item数据' });

        /** 归档 */
        const body = {
            main_id: item._id,
            col_name: CLname,
            data: item,
        }
        let url = 'http://' + process.env.ARCHIVE_HOST
        if (process.env.PORT) url += ':' + process.env.PORT
        url += '/sys_archive/save';
        const result = (await axios({
            method: "POST",
            url,
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })).data;
        if (result.status !== 200) throw ({ message: '归档失败' });

        await COL.deleteOne({ _id });
        return Success(ctx, { item }, { message: '归档成功' });
    } catch (e) {
        console.error(request.url + ' detail: ' + e);
        return Exception(ctx, e);
    }
}


export const res_archiveMany = async (ctx: Context, COL: Model<unknown>, CLmodel: Object, CLname: string) => {
    const { request } = ctx;
    try {
        const { query } = parseQuery(request.query, CLmodel);

        const items = await COL.find(query);

        console.log(1111, items)
        if (items.length > Number(process.env.MAX_DELETE)) throw ({ message: `您归档的条目数 超过了 env.MAX_DELETE ${process.env.MAX_DELETE}` });
        const docs = [];
        for (const item of items) {
            const doc = {
                main_id: item._id,
                col_name: CLname,
                data: item,
            };
            docs.push(doc);
        }

        const body = { docs };
        const result = (await axios({
            method: "POST",
            url: process.env.ARCHIVE_HOST + '/sys_archive/saveMany',
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })).data;
        if (result.stats !== 200) throw ({ message: '归档失败' });

        return Success(ctx, { items })
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        return Exception(ctx, e);
    }
}