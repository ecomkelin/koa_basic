/** 角色对某个数据库的权限
 * 
 */
export const CLname = 'role_col';
export interface Interface extends Document {
    role_id: string;
    col: string;

    is_admin: boolean;  // default: false. 如果为true 下面的不用看了

    allow_create: boolean;

    action: 10 | 20 | 30; // 10: 查看， 20: 修改， 30: 删除, 数字字典

    condition: 10 | 20 | 30 | 40,// 10: 个人层面, 20: 所属部门层面, 30: 及子部门, 40: 公司层面

    able_sets: string[];
    not_selects: string[];

    // create_time: Date;
    // update_time: Date;
    // create_by: Types.ObjectId;
    // update_by: Types.ObjectId;
    // company_id: Types.ObjectId;
}


// const dbSchema = new Schema<Interface_department>(CLmodel, { versionKey: false });

// export default mongoose.model<Interface>(CLname, dbSchema);