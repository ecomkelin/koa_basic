import { Context } from 'koa';
import { v4 } from 'uuid';

import { getTokenFromHeaders, tokenToPayload } from '@src/utils/crypto/jwt';
import { Type_request, Type_exception } from '../sys_pre/sys_log/schema'
export default async function interceptor(ctx: Context, next: Function) {
    const { url, headers, body } = ctx.request;
    const uuid = v4();
    const createAt = new Date();

    if (!ctx.sys_logs) ctx.sys_logs = [];

    const token = getTokenFromHeaders(headers.authorization);
    ctx.payload = {
        _id: "66da572e508bc1e671d39588",
    };
    if (token !== '') {
        const result: any = await tokenToPayload(token);
        if (result.status !== 200) {
            const sys_log: Type_exception = {
                uuid,
                times: ctx.sys_logs.length + 1,
                url,

                status: 401,
                message: '权限错误',

                createAt,
                createBy: ctx.payload?._id
            }
            /** 保存日志 */
            ctx.sys_logs.push(sys_log);

            ctx.status = result.status;
            return ctx.body = result
        }
        ctx.payload = result.data.payload;
    }
    const sys_log: Type_request = {
        uuid,
        times: ctx.sys_logs.length + 1,
        url,

        status: 1,
        body: JSON.stringify(body),

        createAt,
        createBy: ctx.payload?._id
    }
    ctx.sys_logs.push(sys_log);
    /** 保存日志 */


    console.info('\n\n')
    console.info('[Interceptor]: ', createAt);
    console.info('[Interceptor] payload: ', ctx.payload._id ? `${ctx.payload.name || ctx.payload.code || ctx.payload._id}` : 'no token');
    console.info('[Interceptor] uuid: ', uuid);
    console.info('[Interceptor] url: ', url);

    await next();
}