使用说明 

1 在 src/controllers 中写所有的数据库文件
如果文件想要被系统自动录入 格式必须如下:

2 命名格式: 
    [colName].model.ts
3 内容格式: 
export const CLname = "";
export interface Interface extends Document {}
export const CLmodel = {};
const dbSchema = new Schema<Interface>(CLmodel, { versionKey: false });
dbSchema.pre('save', async function (next: Function) { });
export default mongoose.model<Interface>(CLname, dbSchema);

4 CLmodel 内的字段规则: 
    见 mongoose.md 
     mongoose_extend.md 需要经过我们自己的方法
