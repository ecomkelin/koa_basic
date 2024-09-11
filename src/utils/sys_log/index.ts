import { Context } from 'koa';
import axios from 'axios';

import { Type_middle, Type_success, Type_exception } from '@src/sys_pre/sys_log/schema';

/** 创建日志 */
export const save_success_sysLog = (
    { ctx, data }: {
        ctx: Context,
        data?: Object,
    }
) => {
    const { uuid, payload, sys_logs, request } = ctx;
    const { url } = request;
    const createAt = new Date();

    if (!ctx.sys_logs) ctx.sys_logs = [];
    const sys_log: Type_success = {
        uuid,
        times: ctx.sys_logs.length + 1,
        url,

        status: 200,
        data: JSON.stringify(data),

        createAt,
        createBy: payload?._id
    }
    ctx.sys_logs.push(sys_log);
    /** 保存日志 */
    // const createLogUrl = 'http://' + process.env.LOG_HOST + ':' + process.env.PORT + '/log/create';
    // axios.post(createLogUrl, sys_log);
}

/** 创建日志 */
export const save_exception_sysLog = (
    { ctx, status, message }: {
        ctx: Context,
        status: 400 | 401 | 500,
        message: string,
    }
) => {
    const { uuid, payload, sys_logs, request } = ctx;
    const { url } = request;
    const createAt = new Date();

    if (!ctx.sys_logs) ctx.sys_logs = [];
    const sys_log: Type_exception = {
        uuid,
        times: ctx.sys_logs.length + 1,
        url,

        status,
        message,

        createAt,
        createBy: payload?._id
    }
    ctx.sys_logs.push(sys_log);
    /** 保存日志 */
    // const createLogUrl = 'http://' + process.env.LOG_HOST + ':' + process.env.PORT + '/log/create';
    // axios.post(createLogUrl, sys_log);
}

export const save_logMiddle = (
    { ctx, log, intercepted, message }: {
        ctx: Context,
        log: Object,
        intercepted?: boolean,
        message?: string
    }
) => {
    const { uuid, payload } = ctx;
    const { url } = ctx.request;
    const createAt = new Date();

    if (!ctx.sys_logs) ctx.sys_logs = [];
    const sys_log: Type_middle = {
        uuid,
        times: ctx.sys_logs.length + 1,
        url,

        status: 2,
        log: JSON.stringify(log),

        createAt,
        createBy: payload?._id
    }
    ctx.sys_logs.push(sys_log);
    /** 保存日志 */
    // const createLogUrl = 'http://' + process.env.LOG_HOST + ':' + process.env.PORT + '/log/create';
    // axios.post(createLogUrl, sys_log);
}