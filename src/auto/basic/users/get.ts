import { Context } from 'koa';
// import { Model } from 'mongoose';
import COL, { CLmodel } from '@src/collections/user.model'
import { Success, Exception } from '@src/utils/system/res';
import { parseQuery } from '@src/utils/system/parse/parseQuery'

// import 
export default async function service(ctx: Context) {
    const { request } = ctx;
    try {
        const { page, pageSize, query, select, skip, limit, populates, sort } = parseQuery(request.query, CLmodel);
        // if (populates.length === 0) populates.push({ path: "_id" })
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