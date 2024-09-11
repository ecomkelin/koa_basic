// 这里面不需要有 log 日志
export const parseDoc = (doc: Object, CLmodel: Object, payload: Object) => {
    try {
        for (const key in doc) {
            // 这里应该还要判断 _id 并且判断 _id 的是 是不是ObjectId
            if (!CLmodel[key]) throw ({ message: `数据库中没有 [${key}] 字段` });
            // 如果字段是数据 则选取第一个元素 因为模型的数组格式为 contacts: [{ name: String, tel: String}];
            const field = (CLmodel[key] instanceof Array) ? CLmodel[key][0] : CLmodel[key];
            if (field.writable === false) throw ({ message: `数据库中 [${key}] 字段不能手动写入` });
        }
        const now = new Date();
        for (const key in CLmodel) {
            const field = CLmodel[key];
            if (field.payload) {
                if (!payload[field.payload]) throw ({ message: `payload 没有${field.payload} 属性` });
                doc[key] = payload[field.payload];
            }
        }
    } catch (e) {
        throw e;
    }
}