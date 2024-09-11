import dotenv from "dotenv";
dotenv.config();

import Koa from 'koa';
import koaConfig from "./middle/koa/koa_config";
import koaCompress from './middle/koa/koa_compress';
import koaStatic from './middle/koa/koa_static';
import koaBody from './middle/koa/koa_body';
import koa_favicon from './middle/koa/koa_favicon';

import sys_pre from "./sys_pre";
import interceptor from "./middle/interceptor";
import router from './router';

import './middle/__mongoose_connect';


const app: Koa = new Koa();
koaConfig(app); // 对koa的配置
app.use(koaCompress);
app.use(koaStatic); // 配置静态文件夹 public
app.use(koaBody()); // 配置 body参数 并且 body 可以传递图片
app.use(koa_favicon);   // 防止 koa_favicon 报错

/** 日志的保存和查看 需要写在拦截器之前 */
sys_pre(app);

/** token 的调用 写在这里 */
app.use(interceptor);

app.use(router.routes());
app.use(router.allowedMethods()); // 比如 post: login 用户使用了 get 则报 405

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});