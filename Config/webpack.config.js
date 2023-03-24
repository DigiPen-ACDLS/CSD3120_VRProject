// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path              = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = 
{
    mode: 'development',
    target: 'web',
    entry: 
    {
      index: './src/index.ts',
    },
    devtool: 'inline-source-map',
    devServer: 
    {
      static    : true,
      port      : 3000,
      open      : true,
      hot       : true,
      liveReload: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
      }),
      // new CopyWebpackPlugin({
      //   patterns: [
      //     { from: path.resolve(__dirname, 'public') }
      //   ]
      // })
    ],
    resolve: 
    {
        extensions: [".ts", ".js"]
    },
    module: 
    {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    output: 
    {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
};
