import Koa from 'koa';

// 设置 Koa 应用的参数
export default function koaConfig(app: Koa) {
    const env = process.env.ENV || 'dev';
    app.subdomainOffset = 2;
    app.proxy = env === 'dev' ? false : true;
    app.env = env;
}


/**
 * 
app = koa();
>: { subdomainOffset: 2, proxy: false, env: 'dev' }

1、负载均衡服务器，用以提升整体服务器的使用效率，避免单点故障导致的整体宕机。

2、缓存服务器，针对静态文件、极少变化的动态内容进行缓存，提升访问速度。

3、避免真实服务器ip暴露，减少网络攻击的风险。

 */