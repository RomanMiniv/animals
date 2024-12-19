const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * @type import("webpack").Configuration
 */
module.exports = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", "..."],
    alias: {
      "@assets": path.resolve(process.cwd(), "./assets/"),
      "@configs": path.resolve(process.cwd(), "./configs/"),
      "@utils": path.resolve(process.cwd(), "./src/utils"),
      "@shared": path.resolve(process.cwd(), "./src/shared"),
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|avif|webp|mp3)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        }
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
