<!-- 安装依赖 -->
pnpm i
<!-- 启动程序 -->
pnpm dev

<!-- 开发环境配置项 配置项 在根目录下 创建 .env 文件 文件内容如下 -->
ENV=dev

PORT=3000
DB_SERVER=mongodb://localhost/zhy

LOG_HOST=localhost
ARCHIVE_HOST=localhost # 归档地址

ACCESS_TOKEN_SECRET=3d0d3ec8600eca1c4bada36acfda2b650dbed5a28d605cc2f3b48ff33619595d8906544b887dcff99f11757e69f1cea3897c4d55879419442a0e8cdc3fc736eb
ACCESS_TOKEN_EX=30m
REFRESH_TOKEN_SECRET=61a5d986b364b8063248325771f8f313e111f9af6be06789dc80b6c9f9b8de04b1cc99a6d8e33e3a31ab51976e6380589c9ac44a4c0a28c7cda432ed785bb2c7
REFRESH_TOKEN_EX=30d

DIR_COLLECTION=src/collections/ # 数据模型存放的地方
DIR_RESTFUL=src/auto/ # 数据模型存放的地方
MAX_DELETE=1000  # 最多删除的量 
MAX_EVERY_SAVE=500 #saveMany (一条一条的保存) 最多的量