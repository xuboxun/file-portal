const { getFileSize } = require('./tools')
const request = require('request')
const colors = require('colors')

const FORCE_OFFLINE = 'offline'
const FORCE_STREAM = 'stream'

const getFileName = (ctx) => {
  const { url, name } = ctx.query

  const arr = url.split('/')
  const sourceName = arr[arr.length - 1]

  // 除非特殊指定文件名，否则用url默认
  const filename = name || sourceName
  return filename
}

const handleTest = (ctx) => {
  ctx.body = 'test'
}

const handleOffline = (ctx) => {
  console.log(colors.blue('离线任务+1'))
  // todo: 离线任务
  ctx.body = 'ok'
}

const handleStream = (ctx) => {
  const { url } = ctx.query

  console.log(colors.green('文件流传输+1'))
  const filename = getFileName(ctx)

  ctx.set({
    'Content-Disposition': `attachment;filename=${filename}`
  })
  ctx.body = request({
    method: 'get',
    url
  })
}

/**
  * url: 下载地址
  * name?: 指定文件名
  * force?: 强制走流下载或离线下载
  * test?: 是否测试环境
 **/
const handlerMain = async (ctx, next) => {
  const { url, name, force, test } = ctx.query

  if (!url) {
    ctx.body = '请输入url'
    return
  }

  const forceOffline = force === FORCE_OFFLINE
  const forceStream = force === FORCE_STREAM

  const isTest = test === 'true'


  let size = 0
  try {
    size = await getFileSize(url)
    console.log(size)
  } catch(e) {
    console.log(e)
  }

  const overSize = size >= global.config.size * 1024 * 1024

  // 测试专用
  if (isTest) {
    return handleTest(ctx)
  }

  if (forceStream) {
    return handleStream(ctx)
  }

  if (forceOffline) {
    return handleOffline(ctx)
  }


  if (overSize) {
    // 大文件，走离线下载
    return handleOffline(ctx)
  } else {
    // 小文件，直接走流传输
    return handleStream(ctx)
  }
}
 
module.exports = {
  handlerMain
}

