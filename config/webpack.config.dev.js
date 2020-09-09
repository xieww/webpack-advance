const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack"); // 用于访问内置插件
const commonConfig = require("./webpack.config.base");
const config = require("../public/config")["dev"];

const devConfig = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          "style-loader", // 动态创建style标签
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "less-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("./src/index.html"),
      filename: "index.html", //打包后的文件名
      // chunks: ["index"],
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash: true, //是否加上hash，默认是 false
      config: config.template,
    }),
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
    new webpack.DefinePlugin({
      DEV: JSON.stringify("dev"), //字符串
      FLAG: "true", //FLAG 是个布尔类型
    }),
  ],
  optimization: {
    minimize: false,
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    hot: true,
    port: 8000, //默认是8080
    open: true,
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
    proxy: {
      "/api": "http://localhost:3001",
      pathRewrite: { "/api": "" },
      secure: false,
    },
    // 模拟数据
    before: function (app, server, compiler) {
      app.get("/getInfo", function (req, res) {
        res.json({ title: "模拟信息" });
      });
    },
  },
};

module.exports = merge(commonConfig, devConfig);
