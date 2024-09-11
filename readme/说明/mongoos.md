1. required
类型: Boolean or Function
说明: 该字段是否必须存在。
示例:
name: { type: String, required: true }
const loginSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: function() {
      // 如果 email 为空，username 就必填
      return !this.email || this.email.trim() === '';
    }
  },
  email: { 
    type: String, 
    required: function() {
      // 如果 username 为空，email 就必填
      return !this.username || this.username.trim() === '';
    }
  }
});

2. unique
类型: Boolean
说明: 该字段的值是否必须在集合中唯一。
示例:
email: { type: String, unique: true }

3. min
类型: Number
说明: 适用于 Number 类型字段，设置该字段的最小值。
示例:
age: { type: Number, min: 18 }

4. max
类型: Number
说明: 适用于 Number 类型字段，设置该字段的最大值。
示例:
age: { type: Number, max: 65 }

5. enum
类型: Array
说明: 适用于 String 或 Number 类型字段，限制该字段的值必须是枚举值之一。
示例:
role: { type: String, enum: ['user', 'admin', 'guest'] }

6. match
类型: RegExp
说明: 适用于 String 类型字段，指定该字段的值必须匹配的正则表达式。
示例:
email: { type: String, match: /.+\@.+\..+/ }

7. maxlength / minlength
类型: Number
说明: 适用于 String 类型字段，设置字符串的最大/最小长度。
示例:
password: { type: String, minlength: 8, maxlength: 20 }

8. default
类型: Any type or Function
说明: 设置字段的默认值。
示例:
isActive: { type: Boolean, default: true }

9. immutable
类型: Boolean or Function
说明: 一旦设置该字段的值后，便无法再修改。
示例:
createdAt: { type: Date, immutable: true }

10. validate
类型: Function or Object
说明: 使用自定义验证器来验证字段的值。
示例:
email: { 
  type: String, 
  validate: {
    validator: function(v) {
      return /\S+@\S+\.\S+/.test(v);
    },
    message: props => `${props.value} is not a valid email!`
  }
}

11. lowercase
类型: Boolean
说明: 将字符串值转换为小写。
示例:
email: { type: String, lowercase: true }

12. uppercase
类型: Boolean
说明: 将字符串值转换为大写。
示例:
code: { type: String, uppercase: true }

13. trim
类型: Boolean
说明: 去除字符串前后的空格。
示例:
username: { type: String, trim: true }

14. get
类型: Function
说明: 为字段定义一个获取器函数，允许你在获取字段值时对其进行处理。
示例:
amount: { 
  type: Number, 
  get: v => Math.round(v) 
}

15. set
类型: Function
说明: 为字段定义一个设置器函数，允许你在设置字段值时对其进行处理。
示例:
amount: { 
  type: Number, 
  set: v => Math.round(v) 
}

16. select  // 因为做归档 不能用这个。 我做了 selectable替代 归档查询不经过selectable 所以可以完整归档
类型: Boolean
说明: 指定该字段在查询时是否默认被选择。
示例:
password: { type: String, select: false }

17. alias
类型: String
说明: 定义一个字段的别名，允许你通过别名访问字段值。
示例:
name: { type: String, alias: 'fullName' }

18. index
类型: Boolean
说明: 指定该字段是否应该被索引。
示例:
email: { type: String, index: true }

19. sparse
类型: Boolean
说明: 设置稀疏索引，允许集合中有多个文档可以没有此字段或者该字段为空。
示例:
email: { type: String, unique: true, sparse: true }

20. expires
类型: Number or String
说明: 为 Date 类型字段设置 TTL（Time To Live），指定该字段自动过期的时间。
示例:
createdAt: { type: Date, expires: '7d' } // 7天后过期
这些验证器和限制器可以结合使用来创建复杂的验证逻辑，确保存储在 MongoDB 中的数据符合预期。如果你有特定的需求，可以考虑编写自定义验证器或使用现有的这些选项来实现。