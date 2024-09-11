import { Context } from 'koa';
import Router from 'koa-router';
import { Model } from 'mongoose';

import { TypeRouter } from '../../../utils/interface/type'
import { res_delete, res_deleteMany, res_archive, res_archiveMany } from '@src/utils/system/api';


export const generateDeleteApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const path = urlModel + '/delete/:id';
    routers.push({ path, method: "delete", label: `delete: ${urlModel}` });

    router.delete(path, async (ctx: Context) => res_delete(ctx, COL, CLmodel));
}

export const generateDeleteManyApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string,) => {
    const path = urlModel + '/deleteMany';
    routers.push({ path, method: "delete", label: `deleteMany: ${urlModel}` });

    router.delete(path, async (ctx: Context) => res_deleteMany(ctx, COL, CLmodel));
}

// Archive
export const generateArchiveApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string, CLname: string) => {
    const path = urlModel + '/archive/:id';
    routers.push({ path, method: "delete", label: `archive: ${urlModel}` });

    router.delete(path, async (ctx: Context) => res_archive(ctx, COL, CLmodel, CLname));
}

export const generateArchiveManyApi = (router: Router, routers: TypeRouter[], COL: Model<unknown>, CLmodel: Object, urlModel: string, CLname: string) => {
    const path = urlModel + '/archiveMany';
    routers.push({ path, method: "delete", label: `archive: ${urlModel}` });

    router.delete(path, async (ctx: Context) => res_archiveMany(ctx, COL, CLmodel, CLname));
}