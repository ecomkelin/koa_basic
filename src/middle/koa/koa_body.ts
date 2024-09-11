import koaBody from 'koa-body';
import path from 'path';

/** 配置可以上传文件的 koa-body 中间件可接收文件 */
koaBody({
    multipart: true,// 打开多媒体上传
    formidable: {
        // 上传的文件上传到哪个文件下 
        uploadDir: path.resolve(process.cwd(), "public/upload/"),
        keepExtensions: true, // 是否保持 扩展名
    }
});

export default koaBody;