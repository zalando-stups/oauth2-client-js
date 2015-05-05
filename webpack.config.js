var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        './oauth.js'
    ],
    output: {
        path: __dirname + '/dist/',
        filename: 'oauth2-client.js',
        library: 'oauth2-client-js',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.BannerPlugin(require('./banner'))
        // new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        extensions: ['', '.js']
    },
    eslint: {
        configFile: '.eslintrc'
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'eslint' },
        ],
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
        ]
    }
};