module.exports = {
  outputDir: "dist", // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  lintOnSave: false,//是否开启eslint语法检查
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",

  devServer: {
    port: 9000,
    open: true,
    proxy: {
      '/dataView': {
        //代理的后台路径
        target: 'http://localhost:9001',
        pathRewrite: { '^/dataView': 'dataView' }, // 路径重写 若后端接口添加了context-path为/dataView，这里重写后必须为dataView
        //是否跨域
        changeOrigin: true, //true 代理服务器的地址和后台服务器（1001）一致， false// 代理服务器的地址和前台服务器（1000）一致 默认：true
      }
      // 使用一级目录配置 (axios不加前缀，代理后端地址)
      /*'/': {
        target: 'http://localhost:9001',
        changeOrigin: true,
        //代理路径更改
        pathReWrite: {
          '^/': '/'
        }
      }*/
    }
  }
}

