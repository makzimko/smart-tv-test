var NODE_ENV = process.env.NODE_ENV || 'DEV';
var CONFIG = require("./config.json");

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
    context: __dirname + '/src',
    entry: {
        app: './app'
    },
    output: {
        path: __dirname + '/build',
        publicPath: '/build/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.css'],
        modules: [
            'node_modules',
            './src'
        ]
    },

    module: {
        loaders: [{
            test: /\.css/,
            loader: 'style-loader!css-loader'
        }]
    },

    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            CONFIG: JSON.stringify(CONFIG)
        })
    ],

    watch: NODE_ENV == 'DEV',
    watchOptions: {
        aggregateTimeout: 1000
    },

    devtool: NODE_ENV == 'DEV' ? 'cheap-module-inline-source-map': false,
    devServer: {
        contentBase: __dirname,
        hot: true
    }
};

if (NODE_ENV == "BUILD") {
    config.module.loaders = [{
        test: /\.css/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
        })
    }];

    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                unsafe: true
            }
        })
    );
}

module.exports = config;