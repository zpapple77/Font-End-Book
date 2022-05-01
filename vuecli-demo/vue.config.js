const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    //修改端口
    port: 3000,
    open: true,
  },
  lintOnSave: false, //暂时关闭eslint检查啊
})
