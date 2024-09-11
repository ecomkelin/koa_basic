1 创建并进入目录
    mkdir koa_auth
    cd koa_auth

2 创建最基础的依赖包
    pnpm add koa @types/koa typescript ts-node @types/node koa-compress dotenv
    pnpm -D add 
        ts-node tsconfig-paths cross-env 
        eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin 
        @types/koa-compress
        jest ts-jest @types/jest 
        supertest

3 package.json 中的 scripts 配置
    "scripts": {
        "build": "tsc -p tsconfig.json",
        "start": "node dist/main.js",
        "dev": "nodemon -r tsconfig-paths/register --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts",
        "win": "cross-env nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts",
        "test": "echo \"Error: no test specified\" && exit 1"
    },

4 在根目录下 创建 tsconfig.json 文件

5 在根目录 创建version.md readme.md 文件

6 在根目录下 配置环境变量 
    .env 文件

7 在根目录下 配置eslint
    eslint.config.js 配置文件

8 在根目录下 配置 jest
    jest.config.js

8 在根目录下 配置pm2
    pm2.conf.json 配置文件

9 在根目录下 配置git 忽略文件
    .gitignore

10 在根目录下 创建
    logs 文件夹

11 在根目录下 创建 src 文件夹

12 在src 文件夹下 创建 __test__ 文件夹

13 在src 文件夹下 创建 main.ts