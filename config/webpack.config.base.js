const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackBar = require("webpackbar");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

module.exports = {
  entry: path.resolve("./src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"), //必须是绝对路径
    filename: "[name].[hash:6].js",
    // publicPath: "/", //通常是CDN地址
  },
  module: {
    noParse: /jquery|lodash/, // 忽略jQuery，lodash，提升构建性能
    rules: [
      {
        test: /\.js[x]?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
        // exclude: /node_modules/, //排除 node_modules 目录
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, //10K
              esModule: false,
              // name: "[name]_[hash:6].[ext]", // 生成原始文件名+哈希的的新文件名
              // outputPath: "assets", // 资源统一打包到assets的文件夹下
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          // options: {
          //   attributes: false,
          // },
        },
      },
    ],
  },
  plugins: [
    //数组 放着所有的webpack插件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!dll", "!dll/**"], //不删除dll目录
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/js/*.js",
          to: path.resolve(__dirname, "../dist", "js"),
          flatten: true, // true时只拷贝文件，不会把文件夹路径拷贝上
          globOptions: {
            ignore: ["**/x.*"],
          },
        },
      ],
    }),
    new webpack.ProvidePlugin({
      _map: ["lodash", "map"],
      Vue: ["vue/dist/vue.esm.js", "default"],
      $: "jquery",
      React: "react",
    }),
    new WebpackBar(),
    new HardSourceWebpackPlugin(),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/), // //忽略 moment 下的 ./locale 目录
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(
        __dirname,
        "../dist",
        "dll",
        "manifest.json"
      )),
    }),
  ],
  resolve: {
    modules: ["node_modules"],
    alias: {
      utils: path.resolve(__dirname, "../src/utils/"),
    },
    // extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
  externals: {
    jquery: "jQuery",
  },
  optimization: {
    splitChunks: {
      //分割代码块
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1,
          name: "vendor",
          test: /node_modules/,
          chunks: "initial",
          minSize: 100,
          minChunks: 1, //重复引入了几次
        },
      },
    },
    runtimeChunk: {
      name: "mainifest",
    },
    // minimize: true,
    // minimizer: [
    //     new TerserPlugin({
    //         test: /\.js(\?.*)?$/i,
    //     }),
    // ],
  },
};
