想要特殊字符生效需要使用下面的方法:
    1 /src/utils/system/parse/parseDoc.ts
        parseDoc
    2 /src/utils/system/api.ts
        2.1 res_save
        2.2 res_saveMany

1. filterable
类型: Boolean
说明: 如果 filterable 为 false 则不能用这个筛选
示例:
email: { type: String, filterable: false }

2. writable
类型: Boolean
说明: 如果 writable 为 false 则 前端不能填写这些数据
示例:
email: { type: String, writable: false }

3. selectable
类型: Boolean
说明: 指定该字段在查询时是否默认被选择。
示例:
password: { type: String, selectable: false }