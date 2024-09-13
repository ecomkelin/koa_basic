import { Context } from 'koa';
// import { Model } from 'mongoose';
import COL, { CLmodel } from '@src/collections/user.model'
import { Success, Exception } from '@src/utils/system/res';
import { parseQuery } from '@src/utils/system/parse/parseQuery'

// import 
export default async function service(ctx: Context) {
    const { request, params } = ctx;
    try {
        const { _id } = params;
        const { select, populates } = parseQuery(request.query, CLmodel);
        // if (populates.length === 0) populates.push({ path: "str" })
        const item = await COL.findOne({ _id })
            .select(select)
            .populate(populates)
        return Success(ctx, { item });
    } catch (e) {
        console.error(request.url + ' list: ' + e);
        return Exception(ctx, e);
    }
}