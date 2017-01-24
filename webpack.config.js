/// <binding />
var webpack = require('webpack');
var path = require('path');
var WebpackShellPlugin = require('webpack-shell-plugin');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function root(__path) {
    return path.resolve(__path);
}

var NODE_ENV = process.env.NODE_ENV || 'development';
var appStylesPath = 'src\\assets\\styles'.replace(/\\/g, '\\\\');
var vendorStylesPath = 'node_modules|bower_components'.replace(/\\/g, '\\\\');
var appStyles = RegExp(appStylesPath);
var vendorStyles = RegExp('(' + vendorStylesPath + ')');
var bundledStyles = RegExp('(' + vendorStylesPath + '|' + appStylesPath + ')');

//var BACKEND_ADDRESS = 'http://192.168.3.202:7702';
var BACKEND_ADDRESS = 'http://178.215.162.3:1234';

var basePlugins = [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin({ name: ['system', 'app', 'vendor', 'polyfills'], minChunks: Infinity }),
    new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        BACKEND_ADDRESS: JSON.stringify(BACKEND_ADDRESS)
    }),
    new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        root('./src')
      ),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackShellPlugin({
        onBuildStart: ['echo Build started at %time%'],
        onBuildExit: ['echo Build finished at %time%']
    })
];

var devPlugins = [
    new WebpackBuildNotifierPlugin({
        title: "Fieldsmarts.Booking [" + (process.env.NODE_ENV || 'Debug') + ']',
        activateTerminalOnError: true,
        suppressSuccess: false
    })
];

var prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            dead_code: true,
            unused: true,
            angular: true
        },
        comments: false
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    })
];


var plugins = basePlugins.concat((process.env.NODE_ENV === 'production') ? prodPlugins : devPlugins);

var webpackConfig = {
    entry: {
        'polyfills': './src/polyfills.browser.ts',
        'vendor': './src/vendor.browser.ts',
        'system': './src/system.browser.ts',
        'app': './src/app.browser.ts',
        'styles.css': './src/styles.browser.ts'
    },

    output: {
        path: root('./wwwroot'),
        publicPath: '/'
    },

    plugins: plugins,

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader!angular2-template-loader' },

            { test: /\.html$/, loader: 'raw-loader' },

            { test: /\.json$/, loader: 'json-loader' },

            { test: /\.(eot|gif|png)(\?v=\d+\.\d+\.\d+)?$/i, loader: "file-loader" },
            { test: /\.(woff|woff2)/i, loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/i, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/i, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },

            { test: /\.css$/i, exclude: bundledStyles, loader: 'to-string-loader!css-loader' },
            { test: /\.less$/i, exclude: appStyles, loader: 'to-string-loader!less-loader' },
            { test: /\.scss$/i, exclude: appStyles, loader: 'raw-loader!sass-loader' },

            { test: /\.css$/i, include: bundledStyles, loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' }) },
            { test: /\.less$/i, include: appStyles, loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader?sourceMap', 'less-loader'] }) },
            { test: /\.scss$/i, include: appStyles, loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader?sourceMap', 'sass-loader'] }) }
        ]
    }
};

var devWebpackConfig = {
//    devtool: 'eval,cheap-eval-source-map'
    devtool: 'source-map'
};

var prodWebpackConfig = {

};

// Our Webpack Defaults
var defaultConfig = {
    cache: true,
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        modules: ['node_modules', 'src', 'src/components'],
        extensions: ['.ts', '.js']
    },

    devServer: {
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 }
    },

    node: {
        global: true,
        crypto: 'empty',
        module: false,
        fs: 'empty',
        Buffer: true,
        clearImmediate: false,
        setImmediate: false,
    }
};

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig, (process.env.NODE_ENV === 'production') ? prodWebpackConfig : devWebpackConfig);

console.log(process.env.NODE_ENV);
