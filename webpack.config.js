var path = require('path');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, 'public')
    },
    devtool: "cheap-source-map",
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    mode: 'development',
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.html$/i, loader: 'html-loader' },
            { test: /\.vert$/i, loader: 'ts-shader-loader' },
            { test: /\.frag$/i, loader: 'ts-shader-loader' },
        ],
    },
    devServer: {
        hot: true,
        inline: true,
        contentBase: [
            path.join(__dirname, 'public'),
        ],
        port: 3000,
    },
};
