/**
 * 请求代理对象
 * @type {{}}
 */
const proxyObj = {}

/**
 * 通用请求
 * @type {{changeOrigin: boolean, ws: boolean, pathRewrite: {[p: string]: string}, target: string}}
 */
proxyObj[process.env.VUE_APP_BASE_API] = {
  // webSocket
  ws: false,
  //代理的后台路径
  target: process.env.VUE_APP_SERVER_URL, //'http://localhost:9001',
  // 路径重写
  pathRewrite: {
    ['^' + process.env.VUE_APP_BASE_API]: '/' //读取的是 .env.development 文件的 VUE_APP_BASE_API 值
  },
  // pathRewrite: { ['^' + process.env.VUE_APP_BASE_API]: process.env.VUE_APP_BASE_API }, // 若后端接口或nginx需要前缀路径 /api 时
  //是否跨域
  changeOrigin: true, //true 代理服务器的地址和后台服务器（1001）一致， false// 代理服务器的地址和前台服务器（1000）一致 默认：true
}

/**
 * webSocket 请求
 * @type {{changeOrigin: boolean, ws: boolean, target: string}}
 */
proxyObj['/ws'] = {
  ws: true,
  target: process.env.VUE_APP_WS_SERVER_URL, //'ws://localhost:9001',
  changeOrigin: true,
}

module.exports = {
  outputDir: "autumn-ui-dist", // 运行时生成的生产环境构建文件的目录(默认'dist'，构建之前会被清除)
  lintOnSave: false,//是否开启eslint语法检查
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",

  devServer: {
    // 该服务占用端口
    port: 9000,
    open: true,
    proxy: proxyObj
  }
}

