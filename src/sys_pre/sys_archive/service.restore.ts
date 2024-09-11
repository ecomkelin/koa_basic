import { Context } from 'koa';
import { Model } from 'mongoose';
import Console from '@src/utils/dev/console';
import COL_ARCHIVE, { CLmodel } from './schema';
import { parseQuery } from '@src/utils/system/parse/parseQuery';
import { parseDoc } from '@src/utils/system/parse/parseDoc';
import fs from 'fs';
import path from 'path';

const colPath = process.env.DIR_COLLECTION;
const dirPath = path.join(process.cwd(), colPath);

export const restore = async (ctx: Context) => {
    const { request } = ctx;
    try {
        const { query } = parseQuery(request.query, CLmodel);

        const item = await COL_ARCHIVE.findOne(query);
        if (!item) throw ({ message: '没有找到此归档数据' });

        const COL = getCOL(item.col_name);
        await COL.insertMany([item.data]);

        await COL_ARCHIVE.deleteOne({ _id: item._id });

        const status = 200;
        ctx.status = status;
        return ctx.body = { status, data: { message: '您恢复归档', item } };
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        const status = 500;
        ctx.status = status;
        return ctx.body = { status, message: "数据恢复失败 - " + (e as Error).message };
    }
}
export const restoreMany = async (ctx: Context) => {
    const { request } = ctx;
    try {
        const { query } = parseQuery(request.query, CLmodel);
        if (!query['col_name']) throw ({ message: '您的query参数需要有 col_name' });
        if (typeof query['col_name'] !== 'string') throw ({ message: '您的query.col_name的参数必须为 字符串' });
        const COL = getCOL(query['col_name']);

        const items = await COL_ARCHIVE.find(query);
        if (items.length > Number(process.env.MAX_EVERY_SAVE)) ({ message: `您恢复归档的条目数 超过了 env.MAX_EVERY_SAVE ${process.env.MAX_EVERY_SAVE}` });
        if (items.length === 0) throw ({ message: '没有找到此归档数据' });

        const delete_ids = [];
        const _docs: any = [];
        for (const item of items) {
            delete_ids.push(item._id);
            _docs.push(item.data);
        }
        await COL.insertMany(_docs);

        await COL_ARCHIVE.deleteMany({ _id: { $in: delete_ids } });

        const status = 200;
        ctx.status = status;
        return ctx.body = { status, data: { message: '您恢复归档', items } };
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        const status = 500;
        ctx.status = status;
        return ctx.body = { status, message: "数据恢复失败 - " + (e as Error).message };
    }
}



const getCOL = (modelName: string) => {
    try {
        const fileName = modelName + '.model.ts';
        const file = dirPath + fileName;
        if (!fs.existsSync(file)) throw ({ message: `${colPath}文件夹下 没有 ${fileName} 文件` });
        const file_content = require(file);
        const COL: Model<unknown> = file_content.default;
        return COL
    } catch (e) {
        throw e;
    }
}