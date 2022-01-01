module.exports = {
  outputDir: "dist", // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  lintOnSave: false,//是否开启eslint语法检查
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",

  devServer: {
    port: 1000,
    open: true,
    proxy: {
      '/dataView': {
        //代理的后台路径
        target: 'http://localhost:1001',
        pathRewrite: { '^/dataView': 'dataView' },
        //是否跨域
        changeOrigin: true, //true 代理服务器的地址和后台服务器（1001）一致， false// 代理服务器的地址和前台服务器（1000）一致 默认：true
      }
      /*'/': {
        ws: false,
        target: 'http://localhost:1001',
        changeOrigin: true,
        //代理路径更改
        pathReWrite: {
          '^/': '/'
        }
      }*/
    }
  }
}

