const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const commonConfig = require("./webpack.config.base");
const config = require("../public/config")["build"];

const prodConfig = {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("./src/index.html"),
      filename: "index.html", //打包后的文件名
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash: true, //是否加上hash，默认是 false
      config: config.template,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
