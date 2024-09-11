export const CLname = 'department';

export interface Interface extends Document {

    name: string;

    level: number,  // 部门层级
    departments: string[];  // 本部门及所有子部门, 每次 新增 删除 调整部门结构 都要重构 所有部门的子部门

    roles: string[];

    // create_time: Date;
    // update_time: Date;
    // create_by: Types.ObjectId;
    // update_by: Types.ObjectId;
    // department_id: Types.ObjectId;   // 父级部门
    // company_id: Types.ObjectId;
}
export const CLmodel = {};

// const dbSchema = new Schema<Interface_department>(CLmodel, { versionKey: false });

// export default mongoose.model<Interface_department>(CLname, dbSchema);