/*const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    configureWebpack: (config) => {
        config.plugins.push(
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: false, // console
                        drop_console: false,
                        // pure_funcs: ['console.log'] // 移除console
                    },
                },
                sourceMap: false,
                parallel: true,
            }),
        );
    }
}*/

