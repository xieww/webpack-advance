const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackBar = require("webpackbar");

module.exports = {
  entry: path.resolve("./src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"), //必须是绝对路径
    filename: "[name].[hash:6].js",
    // publicPath: "/", //通常是CDN地址
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
        exclude: /node_modules/, //排除 node_modules 目录
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
        exclude: /node_modules/,
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
    new CleanWebpackPlugin(),
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
  ],
  resolve: {
    modules: ["node_modules"],
    alias: {
      utils: path.resolve(__dirname, "../src/utils/"),
    },
    // extensions: ['.wasm', '.mjs', '.js', '.json'],
  },
};
