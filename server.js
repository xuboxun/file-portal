const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const queryString = require('query-string')
const axios = require('axios')
const colors = require('colors')

const handler = require('./handler')

// 方案一：文件流，服务端和客户端同时下载；适用于小文件，100M以下
// 方案二：静态资源，服务端先下载好，客户端网页显示进度，进度完成自动下载静态资源，可看成离线下载；适用于大文件

const server = () => {
  const app = new Koa();
  const router = new Router();

  router.get('/file-portal', handler.handlerMain);


  app
  .use(bodyParser())
  .use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  })
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  })
  .use(router.routes())
  .use(router.allowedMethods());

  return app
}

module.exports = server
