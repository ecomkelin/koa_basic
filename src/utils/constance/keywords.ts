/** 
 * 逻辑查询: $and, $not, $nor, $or
 * 元素查询: $exists, [$not_exists], $type,  
 * 比较查询: '$lt', '$lte', '$gt', '$gte', '$ne', $in, $nin, '$eq'
 * 评估查询: $regex, $where, $text, $expr, $mod, $jsonSchema
 * 数组查询: $all, $size
 * 其他查询: 地理空间 $near, $box ...... 
 * */
export const mongo_comparison = [
    '$lt', '$lte', '$gt', '$gte', '$ne',
    '$regex'
];
