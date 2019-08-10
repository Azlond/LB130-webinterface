const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const config = require('./config.json');

module.exports = (env, options) => ({
    entry: './src/js/light.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: 'light.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            __HOST__: `'${config.host}'`,
            __PORT__: config.port
        }),
        new CopyWebpackPlugin([{
            from: './src/css/',
            to: '../css/'
        },
        {
            from: './src/images',
            to: '../images/'
        }]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: '../light.html',
            minify: {
                collapseWhitespace: true,
                html5: true,
                keepClosingSlash: false,
                preserveLineBreaks: false,
                removeComments: true,
                removeRedundantAttributes: true
            }
        }),
        new BaseHrefWebpackPlugin({ baseHref: `https://${config.host}:${config.port}/light` })
    ]

});
