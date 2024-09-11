// 链接数据库
import mongoose from 'mongoose';
const dbUrl: string = process.env.DB_SERVER as string;

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl)
    .then(() => console.info())
    .catch(error => console.error(`数据库连接失败: ${error}`));