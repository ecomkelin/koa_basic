import { Context } from 'koa';
import Router from 'koa-router';
import { Model } from 'mongoose';

import { TypeRouter } from '../../../utils/interface/type'
import { res_set, res_setMany } from '@src/utils/system/api';


export const generateSetApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const urlSave = urlModel + '/set/:_id';
    routers.push({ path: urlSave, method: "put", label: `set: ${urlModel}` });

    router.put(urlSave, async (ctx: Context) => res_set(ctx, COL, CLmodel));
}


export const generateSetManyApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const urlSave = urlModel + '/setMany';
    routers.push({ path: urlSave, method: "put", label: `setMany: ${urlModel}` });

    router.put(urlSave, async ctx => res_setMany(ctx, COL, CLmodel));
}