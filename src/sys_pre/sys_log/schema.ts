import mongoose, { Schema, Types } from 'mongoose';

export const CLname = 'sys_log';

export interface Interface {
    uuid: string,
    times: number,
    url: string,
    status: 1 | 2 | 200 | 400 | 401 | 500,

    // 1: request   // 这不是响应状态
    body?: string,
    // 2: middle
    log?: string,// JSON.stringify()
    // 200: response Success
    data?: string,
    // 400: response Failure | 401: no auth | 500 exception
    message?: string,

    createAt: Date;
    createBy?: Types.ObjectId;
}

export const CLmodel = {
    uuid: { type: String, required: true },
    times: { type: Number, required: true },
    url: { type: String, required: true },
    status: { type: Number, required: true },

    // 1: request
    body: String,
    // 2: middle
    log: String, // JSON.stringify() JSON.parse()
    // 200: response Success
    data: String,
    // 400: response Failure | 401: no auth | 500 exception
    message: String,
    // 500: exception

    createAt: { type: Date, default: Date.now, immutable: true, writable: false },
    createBy: { type: Schema.Types.ObjectId, ref: 'user', immutable: true, writable: false },
};

const dbSchema = new Schema<Interface>(CLmodel, { versionKey: false });

export default mongoose.model<Interface>(CLname, dbSchema);



/** ============================  ============================ */

// 系统开始 要存的数据
export type Type_request = {
    uuid: string,
    times: number,
    url: string,

    status: 1,
    body: string,// JSON.stringify()

    createAt: Date;
    createBy?: Types.ObjectId | null;
}

// 中间过程 要存的数据
export type Type_middle = {
    uuid: string,
    times: number,
    url: string,

    status: 2,
    log: string,// JSON.stringify()

    createAt: Date;
    createBy?: Types.ObjectId | null;
}

// 成功响应 要存的数据
export type Type_success = {
    uuid: string,
    times: number,
    url: string,

    status: 200,
    data: string,// JSON.stringify()

    createAt: Date;
    createBy?: Types.ObjectId | null;
}

// 失败响应 要存的数据
export type Type_exception = {
    uuid: string,
    times: number,
    url: string,

    status: 400 | 401 | 500,
    message: string,

    createAt: Date;
    createBy?: Types.ObjectId | null;
}