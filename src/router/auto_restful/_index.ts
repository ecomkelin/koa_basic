import Router from 'koa-router';
import { Model } from 'mongoose';

import fs from 'fs';
import path from 'path';

import Console from '@src/utils/dev/console';
import { TypeRouter, RestfulMethod } from '../../utils/interface/type'

const restPath = process.env.DIR_RESTFUL;
const abs_restPath = path.join(process.cwd(), restPath);
const suffixes = ['rest', 'get', 'post', 'put', 'delete'];     // 后缀名 必须为 .model.ts 的文件才能读取

export default function router_auto_restful(router: Router, routers: TypeRouter[]) {
    recur_setRouter(router, routers, abs_restPath);
}

const recur_setRouter = (router: Router, routers: TypeRouter[], dirPath: string) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        const fullPath = path.join(dirPath, dirName);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {       // 规定文件夹不能写. 如果是文件夹 则进一步读取内容
            recur_setRouter(router, routers, path.join(dirPath + dirName + '/'));
        } else {                                    // 如果是文件则 则加载
            const file = dirPath + dirName;
            if (!fs.existsSync(file)) return;

            const dirName_s = dirName.split('.');
            // 文件名 肯定不是ts文件 跳过
            if (dirName_s.length < 2) return;

            // 检查文件 后缀
            const suffixThis = dirName_s[dirName_s.length - 2];
            if (!suffixes.includes(suffixThis)) {
                // Console.warn(`${dirName}不会被读取. 原因：${method}不为${suffix}`, `${__filename}: recur_setRouter dirName_s`);
                return;
            }

            // 生成 url_path
            const ref_path = dirPath.replace(abs_restPath, '').trim();
            const path_s = ref_path.split('/').filter(item => item !== '');
            const fileName_s = dirName_s.slice(0, dirName_s.length - 2);
            fileName_s.forEach(str => path_s.push(str))
            // const fileMainName = dirName_s[0]
            // path_s.push(fileMainName)
            // if (dirName_s.length > 3 && dirName_s[dirName_s.length - 3] === '_id') path_s.push(':_id');
            const url_path = '/' + path_s.join('/');
            console.log(1111, url_path)
            // 
            const file_content = require(file);
            const service = file_content.default;
            const method = suffixThis as RestfulMethod
            routers.push({ path: url_path, method, label: `` });
            router[method](url_path, service);
        }
    });
}

/* ====================================== Post 自动加载文件路由 ====================================== */
/**
 * 
 * @param {Router} router 路由中间件
 * @param {Path} dirPath 当前绝对路径
 * @param {Array} paths 经过的所有 路径的 文件夹名称
 * @param {Number} n 路径的层级
 */
const floorLevel = 0;   // 从第几层开始输入路由路径

const autoFileRecur = (router, dirPath, paths, n) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let fns = dirName.split('.');
        let len = fns.length;
        if (len === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n + 1] = dirName;   // 第number层
            autoFileRecur(router, path.join(dirPath + dirName + '/'), paths, n + 1);
        } else if (len === 3 && fns[len - 1] === "js") {
            let type = fns[1];
            if (['get', 'post', 'put', 'delete'].includes(type)) {
                let file = dirPath + dirName;
                if (fs.existsSync(file)) {
                    let requ = require(file);  // 加载每个文件
                    let url = '';
                    for (let j = floorLevel; j <= n; j++) {
                        url += '/' + paths[j];
                    }
                    url += '/' + dirName.split('.')[0];
                    router.get(url, requ);
                    // routers.push(type + " - " + url);
                }
                // 也就是说 如果 是 XXX.XXX.js 则不加载
            }
        }
    });
}
exports.autoFile = (router, dirName) => {
    let dirPath = path.join(process.cwd(), dirName);
    let path_s = dirName.split('/');
    let path_last = path_s[path_s.length - 1];
    if (!path_last) path_last = path_s[path_s.length - 2];  // 防止 dirName 为： xxx/ paths最后一个为"";
    autoFileRecur(router, dirPath, [path_last], 0);
}
