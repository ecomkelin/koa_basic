import mongoose, { Document, Schema, Types } from 'mongoose';

export const CLname = 'role';
export interface Interface extends Document {
    name: string;

    // create_time: Date;
    // update_time: Date;
    // create_by: Types.ObjectId;
    // update_by: Types.ObjectId;
    // company_id: Types.ObjectId;
}

export const CLmodel = {};

const dbSchema = new Schema<Interface>(CLmodel, { versionKey: false });

export default mongoose.model<Interface>(CLname, dbSchema);