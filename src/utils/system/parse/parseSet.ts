import { Context, Request } from 'koa';
import { parseQuery } from './parseQuery';

export const parseSet = (ctx: Context, CLmodel: Object) => {
    try {
        const { request, payload, params } = ctx;
        const { body } = request;
        const set = body.$set ? body.$set : body;
        const queryObj = body.$query ? body.$query : request.query;
        for (const key in params) queryObj[key] = params[key];
        const { query } = parseQuery(queryObj, CLmodel);

        for (const key in set) {
            if (!CLmodel[key]) throw ({ message: `数据库中没有 [${key}] 字段` });
            // 如果字段是数据 则选取第一个元素 因为模型的数组格式为 contacts: [{ name: String, tel: String}];
            const field = (CLmodel[key] instanceof Array) ? CLmodel[key][0] : CLmodel[key];
            if (field.writable === false) throw ({ message: `数据库中 [${key}] 字段不能写入` });
            if (field.immutable === true) throw ({ message: `数据库中 [${key}] 字段不能更改` });
        }

        const now = new Date();
        for (const key in CLmodel) {
            const field = CLmodel[key];
            if (field.immutable === true) continue;
            if (field.updateDate) set[key] = now;
            if (field.payload) {
                if (!payload[field.payload]) throw ({ message: `payload 没有${field.payload} 属性` });
                set[key] = payload[field.payload];
            }
        }
        return { query, set }
    } catch (e) {
        throw e;
    }
}