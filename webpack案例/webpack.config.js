const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js', //入口
  output: {
    //出口
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      //plugins插件配置
      template: './public/index.html', //告诉webpack使用插件时，
      //以我们自己的html文件作为模板去生成dist/hyml文件
    }),
  ],
  module: {
    //加载器配置
    rules: [
      //规则
      {
        //一个具体的规则对象
        test: /\.css$/i, //匹配.css结尾的文件

        use: [
          //一个具体的规则对象
          'style-loder', //让webpack使用这两个loader处理css文件
          'css-loader', //从右到左，所以不能颠倒顺序
          //css-loader webpack解析css文件-把css代码一起打包进js中
          //style-loader css代码插入到DOM上（style标签）
        ],
      },
      {
        test: /\.less$/i, //匹配.less结尾的文件
        use: [
          //一个具体的规则对象
          'style-loder', //让webpack使用这两个loader处理css文件
          'css-loader', //从右到左，所以不能颠倒顺序
          'less-loader',
          //css-loader webpack解析css文件-把css代码一起打包进js中
          //style-loader css代码插入到DOM上（style标签）
        ],
      },
      {
        //图片文件的配置（仅适用于webpack5版本）
        test: /\.(png|gif|jpg|jpeg)$/,
        type: 'asset', //匹配上面的文件之后，webpack会把他们当作静态资源处理打包
        //如果设置的是asset模式
        //以8kb大小区分图片文件
        //小于8KB的，把图片文件赚base64，打包进js中
        //大于8KB的，文件自动命名输出到dist下

        //图片转base64打包进js中的好处和坏处
        //好处：减少了浏览器发送请求次数，读取图片速度快
        //坏处：图片过大，转成base64占空间会多30%左右
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        type: 'asset/resource', //所有的字体图标文件，都输出到dist下
        generator: {
          filename: 'fonts/[name].[hash:6].[ext]', //[ext会替换成.eot/.woff]
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,//不去匹配这些文件夹下的文件
        use: {
          loader: 'babel-loader',//使用这个loader处理js
          options: {//加载器的选项
            presets: ['@babel/preset-env']//预设@babel/preset-env降级规则-按照这里的规则降级我们的js语法
          }
        }
      }
    ],
  },
  devserve:{//修改端口号
    port:3000
  }
}
