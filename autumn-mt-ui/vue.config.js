// 解决内网穿透，添加该文件
module.exports = {
  outputDir: 'autumn-mt-ui-dist',
  devServer: {
    host: '0.0.0.0',
    port: 9002,
    hot: true,
    disableHostCheck: true,
    // proxy: {
    //   '/api': {
    //     target: process.env.VUE_APP_SERVER_URL,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
}
