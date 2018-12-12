const ip = require('ip')
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const dev = process.argv.slice(-1) === 'development' ? true : false
const mode = dev ? 'development' : 'production'

module.exports = {
  mode: mode,
  watch: dev ? false : true,
  devtool: dev ? 'source-map' : 'none',
  entry: {
    main: './demo/test.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'test' + (dev ? '.dev' : '') + '.js'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  optimization: {
    nodeEnv: mode,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          },
          mangle: {
            safari10: true
          }
        },
        test: /\.js($|\?)/i,
        exclude: /node_modules/,
        sourceMap: false,
        parallel: true
      })
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'ShadowFunction'
    }),
  ],
  devServer:{
    contentBase:'./',
    host: ip.address(),
    hot: true
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: '/node_moduels/'
  }
}