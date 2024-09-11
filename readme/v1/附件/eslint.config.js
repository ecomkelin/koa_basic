// eslint.config.js
const { parse } = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ["dist", "node_modules"]
    },
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: {
                parse: parse
            },
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
        },
        rules: {
            // ...require('eslint/conf/eslint-recommended').rules,
            // ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
            // 你的自定义规则
            "indent": ["error", 4],
            "semi": ["error", "always"]
        }
    }
];
