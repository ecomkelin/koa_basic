import Router from 'koa-router';
import { Model } from 'mongoose';

import fs from 'fs';
import path from 'path';

import Console from '@src/utils/dev/console';
import { TypeRouter } from '../../utils/interface/type'

export default function autoRest(router: Router, routers: TypeRouter[], dirName: string, suffix?: string) {
    const dirPath = path.join(process.cwd(), dirName);
    const path_s = dirName.split("/");
    let path_last = path_s[path_s.length - 1];
    if (!path_last) path_last = path_s[path_s.length - 2];  // 防止 dirName 为： xxx/ paths最后一个为"";
}
const getRestRecur = () => {

}
// /* ====================================== Post 自动加载文件路由 ====================================== */
// /**
//  * 
//  * @param {Router} router 路由中间件
//  * @param {Path} dirPath 当前绝对路径
//  * @param {Array} paths 经过的所有 路径的 文件夹名称
//  * @param {Number} n 路径的层级
//  */
// const floorLevel = 0;   // 从第几层开始输入路由路径

// const autoFileRecur = (router, dirPath, paths, n) => {
//     fs.readdirSync(dirPath).forEach(dirName => {
//         let fns = dirName.split('.');
//         let len = fns.length;
//         if (len === 1) {       // 如果是文件夹 则进一步读取内容
//             paths[n + 1] = dirName;   // 第number层
//             autoFileRecur(router, path.join(dirPath + dirName + '/'), paths, n + 1);
//         } else if (len === 3 && fns[len - 1] === "js") {
//             let type = fns[1];
//             if (['get', 'post', 'put', 'delete'].includes(type)) {
//                 let file = dirPath + dirName;
//                 if (fs.existsSync(file)) {
//                     let requ = require(file);  // 加载每个文件
//                     let url = '';
//                     for (let j = floorLevel; j <= n; j++) {
//                         url += '/' + paths[j];
//                     }
//                     url += '/' + dirName.split('.')[0];
//                     router.get(url, requ);
//                     routers.push(type + " - " + url);
//                 }
//                 // 也就是说 如果 是 XXX.XXX.js 则不加载
//             }
//         }
//     });
// }
// exports.autoFile = (router, dirName) => {
//     let dirPath = path.join(process.cwd(), dirName);
//     let path_s = dirName.split('/');
//     let path_last = path_s[path_s.length - 1];
//     if (!path_last) path_last = path_s[path_s.length - 2];  // 防止 dirName 为： xxx/ paths最后一个为"";
//     autoFileRecur(router, dirPath, [path_last], 0);
// }
