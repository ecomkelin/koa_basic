import { Context } from 'koa';
import Router from 'koa-router';
import { Model } from 'mongoose';

import { TypeRouter } from '../../../utils/interface/type'

import { res_list, res_detail, res_find } from '@src/utils/system/api';

export const generateFindApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const path = urlModel + '/find';
    routers.push({ path, method: "get", label: `find: ${urlModel}` });
    router.get(path, async (ctx: Context) => res_find(ctx, COL, CLmodel));
}


export const generateListApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const path = urlModel + '/list';
    routers.push({ path, method: "get", label: `list: ${urlModel}` });
    router.get(path, async (ctx: Context) => res_list(ctx, COL, CLmodel));
}

export const generateDetailApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const path = urlModel + '/detail/:_id';
    routers.push({ path, method: "get", label: `detail: ${urlModel}` });
    router.get(path, async (ctx: Context) => res_detail(ctx, COL, CLmodel));
}




export const generateModelApi = (router: Router, routers: TypeRouter[], CLmodel: Object, urlModel: string,) => {
    routers.push({ path: urlModel, method: "get", label: `Collection: ${urlModel}` });
    router.get(urlModel, ctx => {
        ctx.body = { CLmodel }
    });
}