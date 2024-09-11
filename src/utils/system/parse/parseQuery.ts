import { mongo_comparison } from '../../constance/keywords';

/** 格式化 query */
export const parseQuery = (query: any, CLmodel: Object) => {
    try {
        const { limit, skip, page, pageSize } = getLimitPage(query);

        const populates: any[] = getPopulates(query.populates);
        delete query.populates;

        const sort: any = getSort(query.sort);
        delete query.sort;

        const select = setSelect(query, CLmodel);

        /** 设置query 把query 变为find(query) filter 一定在最后面 */
        const filter = setQuery(query, CLmodel);

        return { page, pageSize, skip, limit, select, populates, sort, query: filter }
    } catch (e) {
        throw e;
    }
}

/** 设置query 把query 变为find(query) */
const setQuery = (query: any, CLmodel: Object) => {
    try {
        const filter: Object = {};
        // 简化代码 比如 {age: {$gt: 18, $lt:30}} 直接为 {$and: [{age: {$gt:18}}, {age: {$lt: 30}}]};
        // if (!query['$and']) query['$and'] = [];
        filter['$and'] = [];
        for (const key in query) {
            /** 把字段 和 特殊字符分离 */
            const { special_key, field } = getField(key, CLmodel);
            if (!special_key) {
                filter[key] = query[key]; // 如果没有特殊字符 则直接使用query的内容
                continue;
            }

            /** 如果有 特殊字符 的情况 需要做以下逻辑 */
            const condition = { [field]: { [special_key]: query[key] } };
            // 如果是模糊匹配 则需要自动加入 忽略大小写
            if (special_key === '$regex') condition[field]['$options'] = 'i';
            filter['$and'].push(condition);
            // 删除原来的query值
        }
        // 为了防止报错 如果{$and: []}是空数组 则删除
        if (filter['$and'].length === 0) delete filter['$and'];
        return filter;
    } catch (e) {
        throw e;
    }
}

/** 设置query 把query 变为find(query) */
const setSelect = (query: any, CLmodel: Object) => {
    try {
        let select: string;
        if (query.select) {
            select = query.select;
            delete query.select;
            const select_s: string[] = select.split(' ');
            for (const key of select_s) {
                if (key === '_id') continue;
                if (!CLmodel[key]) throw ({ message: '没有此字段' });
                if (CLmodel[key].selectable === false) throw ({ message: '您不能查看此字段' });
            }
        } else {
            select = '_id'
            for (const key in CLmodel) {
                const field = CLmodel[key];
                if (field.selectable === false) continue;
                select += ` ${key}`;
            }
        }
        return select;
    } catch (e) {
        throw e;
    }
}


/** 提炼关键字 */
const getField = (input: string, CLmodel: Object): { field: string, special_key?: string } => {
    try {
        if (input[0] !== '$') return { field: input };

        // 查看所有特殊字符串
        let special_key: string = null;
        let field: string = input;
        for (const key of mongo_comparison) {
            /** 如果输入的字段中 存在特殊字符串 */
            if (input.startsWith(key + '.')) {
                // 提炼出 字段
                special_key = key;
                field = input.slice(key.length + 1);
                // 查看字段是否在 数据库中的字段
                break;
            }
        }
        matchField(field, CLmodel);
        if (!special_key) throw ({ message: `您输入的参数 [${input}] 错误` });
        return { special_key, field };
    } catch (e) {
        throw e;
    }
}

const matchField = (field: string, CLmodel: Object) => {
    try {
        // 如果 为 _id 则直接通过
        if (field === '_id') return;
        // 如果 类型是 Object 则直接通过。 如果后面出现错误 让数据库去判断就好
        if (CLmodel[field].type === Object) return;

        const field_s = field.split('.');
        let model = CLmodel;
        for (const key of field_s) {
            if (!model[key]) throw ({ message: '文档表中没有这个字段' });
            model = model[key] instanceof Array ? model[key][0] : model[key];
            // 如果 子类型是 Object 则直接通过
            if (model[key].type === Object) return;
        }
        return;
    } catch (e) {
        throw e;
    }
}

const getLimitPage = (query: any) => {
    try {
        let limit: number = 30;
        let skip: number = 0;

        let pageSize: number = limit;
        let page: number = 1;

        if (query.pageSize) {
            limit = pageSize = Number(query.pageSize);
            if (isNaN(pageSize) || pageSize < 1) throw new Error(`pageSize 参数错误 ${query.pageSize}`);
            page = Number(query.page) || 1;
            if (isNaN(page) || page < 1) throw new Error(`page 参数错误 ${query.page}`);
            skip = (page - 1) * pageSize;
        } else if (query.limit) {
            limit = pageSize = Number(query.limit);
            if (isNaN(limit) || limit < 1) throw new Error(`limit 参数错误 ${query.limit}`);

            skip = Number(query.skip) || 0;
            if (isNaN(skip) || skip < 1) throw new Error(`skip 参数错误 ${query.skip}`);

            page = skip / pageSize + 1;
            if (skip % pageSize !== 0) page = 1;
        }
        delete query.limit;
        delete query.skip;
        delete query.page;
        delete query.pageSize;

        return { limit, skip, page, pageSize };
    } catch (e) {
        throw e;
    }
}

const getPopulates = (queryPopulates: any) => {
    let populates: any[] = [];
    if (queryPopulates) {
        try {
            populates = JSON.parse(queryPopulates)
        } catch (e) {
            if (queryPopulates) {
                const strArr: string[] = queryPopulates.split('-');
                for (const path of strArr) {
                    populates.push({ path })
                }
            }
        }
    }
    return populates;
}

const getSort = (querySort: any) => {
    let sort: any = {};
    if (querySort) {
        try {
            sort = JSON.parse(querySort);
        } catch (e) {
            sort = { sort: -1, _id: -1 };
        }
    }
    return sort;
}