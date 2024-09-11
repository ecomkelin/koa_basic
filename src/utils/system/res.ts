import { Context } from 'koa';
import { save_success_sysLog, save_exception_sysLog } from '../sys_log';



/** 下面是 3种相应方式 */
export const Success = (ctx: Context, data: any, options?: { message?: string }) => {
    const status = 200;
    const { uuid, payload, request } = ctx;

    const message = request.url + ': ' + (options?.message || '成功');

    save_success_sysLog({ ctx, data })
    ctx.status = status;
    return ctx.body = { status, uuid, message, payload, data };
}

export const Exception = (ctx: Context, e: any) => {
    const { uuid, payload, request } = ctx;
    const { url } = request;
    if (e instanceof Error) {
        const status = 500;
        const message = url + '[异常]: ' + e.message;
        save_exception_sysLog({ ctx, status, message });
        ctx.status = status;
        return ctx.body = { status, uuid, message, payload };
    } else {
        const status = e.status || 400;
        const message = e.message || url + '[失败]';
        save_exception_sysLog({ ctx, status, message });
        return ctx.body = { status, uuid, message, payload };
    }
}

