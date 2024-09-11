export const CLname = 'company';

export interface Interface extends Document {

    code: string;
    name: string;

    contacts?: {
        name: string,
        phone: string,
        email: string,
        address: string,
        fax: string,
    }[],

    // create_time?: Date;
    // update_time?: Date;
    // create_by?: Types.ObjectId;
    // update_by?: Types.ObjectId;
}
export const CLmodel = {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contacts: [{
        name: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        fax: { type: String },
    }],
};
// const dbSchema = new Schema<Interface_company>(CLmodel, { versionKey: false });

// export default mongoose.model<Interface_company>(CLname, dbSchema);