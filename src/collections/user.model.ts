import mongoose, { Document, Schema, Types } from 'mongoose';
import * as argon2 from "argon2";

export const CLname = 'user';
export interface Interface extends Document {
    phone: string;
    email: string;

    code: string;
    password: string;

    name: string;
    age: number;

    contacts: {
        resp: string,
        tel: string
    }[],

    addr: {
        city: string,
        code: number
    },

    createAt: Date;
    updateAt: Date;
    createBy: Types.ObjectId;
    updateBy: Types.ObjectId;
}

export const CLmodel = {
    code: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    name: { type: String, required: true },
    age: {
        type: Number,
        validate: {
            validator: function (value: number) {
                return value >= 18;
            },
            message: '年龄 age 至少为 18.'
        }
    },

    contact: [{
        resp: String,
        tel: String
    }],

    addr: {
        city: String,
        code: Number
    },

    createAt: { type: Date, default: Date.now, immutable: true, writable: false },
    updateAt: { type: Date, default: Date.now, writable: false },
    createBy: { type: Schema.Types.ObjectId, ref: 'user', payload: '_id', immutable: true, writable: false },
    updateBy: { type: Schema.Types.ObjectId, ref: 'user', writable: false },
};

const dbSchema = new Schema<Interface>(CLmodel, { versionKey: false });

dbSchema.pre('save', async function (next: Function) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model<Interface>(CLname, dbSchema);