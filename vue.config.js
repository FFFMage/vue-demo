module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        components: '@/components',
        views: '@/views',
        common: '@/common',
        network: '@/network'
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.web-jshtml.cn/productapi/token',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
