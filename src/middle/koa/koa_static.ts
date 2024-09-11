import KoaStatic from 'koa-static';
import path from 'path';

/** 配置静态文件夹 */
const DIR_PUBLIC = path.resolve(process.cwd(), "public/");

export default KoaStatic(DIR_PUBLIC)