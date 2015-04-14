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
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
        ]
    }
};