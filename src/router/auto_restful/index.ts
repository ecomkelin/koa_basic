// import Router from 'koa-router';
// import { TypeRouter } from '../../utils/interface/type'

// import autoModel from './auto_model';


// // const dir_file = 'src/app/auto/';
// // const suffix_rest = ['get', 'post', 'put', 'delete'];

// // // const prefix = "/v1";
// export default function router_auto(router: Router, routers: TypeRouter[]) {
//     /** 配置数据 放到 sys_config 数据库 上去 */

//     /** 
//      * 直接从 model 数据中自动生成数据
//      * src/collections文件夹下 所有带有model后缀的 数据库集合的 api
//      */
//     autoModel(router, routers);

//     /**
//      * 读取 app/auto 文件夹下的 所有 *.rest.ts *.get.ts *.put.ts *.delete.ts *.post.ts 文件
//      * rest文件的 函数名 必须包含['get', 'put', 'post', 'delete']其中之一的字符串
//      * 方法必须是(ctx, next) 
//      */
//     // /** 'Auto' post("/auto/XXX/XXX") 
//     //  * 是读取的文件夹 
//     //  * 自动读取文件夹下的所有文件
//     //  * 并自动命名路由 */
//     // JSrouter.autoFile(router, autoDir);
// }