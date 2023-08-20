const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
let packagedeps = require('./package.json');

module.exports = {
    entry: {
        vendordiagram: Object.keys(packagedeps.dependencies),
        vendor: ["three"],
        index: { dependOn: 'vendor', import: './src/index.ts' },
        diagram: { dependOn: 'vendordiagram', import: './src/diagrams.ts' }
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
          },
        allowedHosts: ['.gitpod.io'],
        host: '0.0.0.0',
        compress: true,
        port: 8080,
        client: {
            progress: true,
        }
    },
    performance: { hints: false },
    mode: 'production',
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
        usedExports: true,
        moduleIds: 'named'
    },
    stats: {
        errorDetails: true
    }
};