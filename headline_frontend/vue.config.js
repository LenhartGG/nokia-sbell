const webpack = require("webpack");

const port= 9991; // npm run dev
const devHost = '0.0.0.0';
// const requestHost = 'http://localhost:3001'; //local mock
// const requestHost='http://135.252.218.128:8080';  //Li Ying dev
// const requestHost = 'http://135.252.218.128:8443'; //dev requst host Li Ying
// const requestHost='http://135.252.217.208:8080'; //Zenwen dev
// const requestHost='http://135.252.218.139:30005';  //deploy http
// const requestHost = 'https://135.252.217.208:8443'; //正式版 https
const requestHost = 'https://headline.int.nokia-sbell.com:8443'; //正式版 https
// const requestHost = 'https://headline.int.nokia-sbell.com:30005'; //测试版 https

const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
const CopyWebpackPlugin = require('copy-webpack-plugin');

const Timestamp = new Date().getTime();

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/'
  : '/',

  outputDir: 'dist',

  assetsDir: 'static',

  filenameHashing: true,


  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,

  // lintOnSave: process.env.NODE_ENV !== 'production',

  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: true,

  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],

  // 生产环境 sourceMap
  productionSourceMap: false,

  // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
  // corsUseCredentials: false,
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      devtool: 'source-map'
    } else {
      // 为开发环境修改配置...
      devtool: 'source-map'
    }
  },

  // webpack 链接 API，用于生成和修改 webapck 配置
  // https://github.com/mozilla-neutrino/webpack-chain
  chainWebpack: (config) => {
    // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
    // config.optimization
    //   .splitChunks({
    //     cacheGroups: {}
    //   });

    // 'src/lib' 目录下为外部库文件，不参与 eslint 检测
    config.module
      .rule('eslint')
      .exclude
      .add('/Users/maybexia/Downloads/FE/community_built-in/src/lib')
      .end()

    //修改文件引入自定义路径
    config.resolve.alias
    .set('@', resolve('src'))
  },

  // 配置高于chainWebpack中关于 css loader 的配置
  css: {
    // 是否开启支持 foo.module.css 样式
    modules: false,

    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
    extract: false,

    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false,

    // css预设器配置项
    // loaderOptions: {
    //   css: {
    //     // options here will be passed to css-loader
    //   },

    //   postcss: {
    //     // options here will be passed to postcss-loader
    //   }
    // }
  },

  // All options for webpack-dev-server are supported
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    open: false,

    host: devHost,

    port: port,

    // https: true,

    hotOnly: false,

    // proxy: null,
    //设置代理,解决跨域问题
    proxy: {
      '/api': {
        target: requestHost+"/api",// dev
        // target: mockRequestHost+"/api",//local mock 
        ws: false,
        changeOrigin: true
      }
    },

    public: '10.243.28.45',
    

    // 让浏览器 overlay 同时显示警告和错误：
    overlay: {
      // warnings: true,
      // errors: true
    },

    before: app => {
    }
  },  
  
  // 构建时开启多进程处理 babel 编译
  // parallel: require('os').cpus().length > 1,

  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {
    // iconPaths: {
    //   favicon32: './plug_jchLogo.ico',
    //   favicon16: './plug_jchLogo.ico',
    //   appleTouchIcon: './plug_jchLogo.ico',
    //   maskIcon: './plug_jchLogo.ico',
    //   msTileImage: './plug_jchLogo.ico'
    // }
  },

  // 第三方插件配置
  pluginOptions: {}
}