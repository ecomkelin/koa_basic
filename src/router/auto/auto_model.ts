import Router from 'koa-router';
import { Model } from 'mongoose';

import fs from 'fs';
import path from 'path';

import Console from '@src/utils/dev/console';
import { TypeRouter } from '../../utils/interface/type'

import { generateFindApi, generateListApi, generateDetailApi, generateModelApi } from './auto_model/get';
import { generateSaveApi, generateSaveManyApi } from './auto_model/post';
import { generateSetApi, generateSetManyApi } from './auto_model/set';
import { generateDeleteApi, generateDeleteManyApi, generateArchiveApi, generateArchiveManyApi } from './auto_model/delete';

// // 文件夹配置
const colPath = process.env.DIR_COLLECTION;
const suffix = 'model';     // 后缀名 必须为 .model.ts 的文件才能读取

export default function autoModel(router: Router, routers: TypeRouter[]) {
    const dirPath = path.join(process.cwd(), colPath);
    const path_s = dirPath.split("/");
    let path_last = path_s[path_s.length - 1];
    if (!path_last) path_last = path_s[path_s.length - 2];  // 防止 dirName 为： xxx/ paths最后一个为"";
    getModelRecur(router, routers, dirPath, [path_last], 0);
}

/**
 * 
 * @param router 
 * @param routers 
 * @param dirPath 
 * @param paths 从 src/ 所有文件夹的路径（不包含 src) 如 ~/src/auto/user/ paths 为 ['auto', 'user']
 * @param n 
 */
const getModelRecur = (router: Router, routers: TypeRouter[], dirPath: string, paths: string[], n: number) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        const fullPath = path.join(dirPath, dirName);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {       // 规定文件夹不能写. 如果是文件夹 则进一步读取内容
            paths[n + 1] = dirName;
            getModelRecur(router, routers, path.join(dirPath + dirName + '/'), paths, n + 1);
        } else {                                    // 如果是文件则 则加载
            const dirName_s = dirName.split('.');
            // 文件名 肯定不是ts文件 跳过
            if (dirName_s.length < 2) return;

            // 如果限制了 后缀比如 model, 则只要不是model的集合 不在这个规则内
            const suffixThis = dirName_s[dirName_s.length - 2];
            if (suffix && suffix !== suffixThis) {
                // Console.warn(`${dirName}不会被读取. 原因：${suffixThis}不为${suffix}`, `${__filename}: getModelRecur dirName_s`);
                return;
            }

            const fileMainName = dirName_s[0];
            const file = dirPath + dirName;
            if (!fs.existsSync(file)) return;

            let preUrl = '';
            paths.forEach(str => preUrl += '/' + str);
            const urlModel = preUrl + '/' + fileMainName;// 路径 可简化为 
            const file_content = require(file);

            if (!file_content.CLmodel) Console.error(`${dirName}文件中没有 CLmodel`, `${__filename}: getModelRecur file_content`);
            const CLmodel = file_content.CLmodel;
            generateModelApi(router, routers, file_content.CLmodel, urlModel);  // 生成model的api

            // 导出 COL模型
            if (!file_content.default) Console.error(`${dirName}文件中没有 default`, `${__filename}: getModelRecur file_content`);
            const COL: Model<unknown> = file_content.default;

            // 
            if (!file_content.CLname) Console.error(`${dirName}文件中没有 CLname`, `${__filename}: getModelRecur file_content`);
            const CLname: string = file_content.CLname;

            /** get find list detail */
            generateListApi(router, routers, COL, CLmodel, urlModel);
            generateFindApi(router, routers, COL, CLmodel, urlModel);
            generateDetailApi(router, routers, COL, CLmodel, urlModel);

            /** post 保存 */
            generateSaveApi(router, routers, COL, CLmodel, urlModel);
            generateSaveManyApi(router, routers, COL, CLmodel, urlModel);

            /** put 保存 */
            generateSetApi(router, routers, COL, CLmodel, urlModel);
            generateSetManyApi(router, routers, COL, CLmodel, urlModel);

            /** delete 删除 或归档 */
            generateDeleteApi(router, routers, COL, CLmodel, urlModel);
            generateDeleteManyApi(router, routers, COL, CLmodel, urlModel);
            generateArchiveApi(router, routers, COL, CLmodel, urlModel, CLname);
            generateArchiveManyApi(router, routers, COL, CLmodel, urlModel, CLname);
        }
    });
}
