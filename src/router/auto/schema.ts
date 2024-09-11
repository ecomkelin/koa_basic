import mongoose, { Schema, Types } from 'mongoose';

export const CLname = 'sys_archive';

export interface Interface {
    main_id: Types.ObjectId,
    col_name: string,
    data: Object,

    createAt: Date;
    createBy?: Types.ObjectId; // 归档人
}

export const CLmodel = {
    main_id: { type: Schema.Types.ObjectId },
    col_name: { type: String, required: true },
    data: { type: Object, required: true },

    createAt: { type: Date, default: Date.now, immutable: true, writable: false },
    createBy: { type: Schema.Types.ObjectId, ref: 'user', immutable: true, writable: false },
};

const dbSchema = new Schema<Interface>(CLmodel, { versionKey: false });

export default mongoose.model<Interface>(CLname, dbSchema);