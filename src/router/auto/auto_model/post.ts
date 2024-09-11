import { Context } from 'koa';
import Router from 'koa-router';
import { Model } from 'mongoose';

import { TypeRouter } from '../../../utils/interface/type'
import { res_save, res_saveMany } from '@src/utils/system/api';


export const generateSaveApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const urlSave = urlModel + '/save';
    routers.push({ path: urlSave, method: "post", label: `save: ${urlModel}` });

    router.post(urlSave, async (ctx: Context) => res_save(ctx, COL, CLmodel));
}


export const generateSaveManyApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const urlSave = urlModel + '/saveMany';
    routers.push({ path: urlSave, method: "post", label: `saveMany: ${urlModel}` });

    router.post(urlSave, async ctx => res_saveMany(ctx, COL, CLmodel));
}