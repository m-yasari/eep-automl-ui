const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

//const reactPatch = require.resolve('react-hot-loader/patch');
const babelPollyfill = require.resolve('babel-polyfill');

const minifyCSS = new ExtractTextPlugin("css/[name].css");

module.exports = {
    entry: {
        client: [
            './src/index.js',
            babelPollyfill
        ],
        main: './src/css/main.css'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/static/'
    },
    module: {
        rules: [
          { test: /\.txt$/, use: 'raw-loader' },
          { test: /\.(png|gif|jp?g)$/, use: [
              {
                  loader: 'file-loader', options: { name: 'images/[name].[ext]' }
              }
            ]    
          },
          { test: /\.css$/, use: minifyCSS.extract('css-loader', 'postcss-loader') },
          { test: /\.js$/, use: [
              { loader: 'babel-loader', options: { presets: ["env", "react"]} }
            ],
            exclude: /node_modules/
          },
          { test: /\.jsx$/, use: [
              { loader: 'babel-loader', options: { presets: ["env", "react"]} }
            ],
            exclude: /node_modules/
          }
        ]
    },
    plugins: [
        minifyCSS,
        new CopyWebpackPlugin([
            {from: 'src/index.html'},
            {from: 'src/api', to: 'api'},
            {from: 'src/img', to: 'img'}
        ])
    ],
    devtool: 'source-map'
}