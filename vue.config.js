module.exports = {
  outputDir: "dist", // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  lintOnSave: false,//是否开启eslint语法检查
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",

  devServer: {
    port: 9000,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        ws: false,
        //代理的后台路径
        target: 'http://localhost:9001',
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '/' //读取的是 .env.development 文件的 VUE_APP_BASE_API 值
        },
        // pathRewrite: { '^/dataView': 'dataView' }, // 路径重写 若后端接口添加了context-path为/dataView，这里重写后必须为dataView
        //是否跨域
        changeOrigin: true, //true 代理服务器的地址和后台服务器（1001）一致， false// 代理服务器的地址和前台服务器（1000）一致 默认：true
      },
      // websocket
      ['/ws']: {
        ws: true,
        target: 'ws://localhost:9001',
        changeOrigin: true,
      }
    }
  }
}

