const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const commonConfig = require("./webpack.config.base");
const config = require("../public/config")["build"];

const prodConfig = {
  mode: "production",
  // devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          //替换之前的 style-loader,作用为抽离css样式为单独文件
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              hmr: true, // 只在开发模式中启用热更新
              reloadAll: true, // 如果模块热更新不起作用，重新加载全部样式
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/";
              },
            },
          },
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
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:6].css",
      // chunkFilename: '[id].css',
    }),
    new OptimizeCssPlugin(), // 压缩css
  ],
};

const Config =
  process.env.ANALYZE === "1" &&
  prodConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = smp.wrap(merge(commonConfig, prodConfig));
