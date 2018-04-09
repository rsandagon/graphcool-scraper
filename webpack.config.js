import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import LiveReloadPlugin from 'webpack-livereload-plugin'

export default{
    entry: './client/index.js',
    mode: 'development',
    output: {
        path: '/',
        filename: 'bundle.js'
    },
    devServer: {
        lazy:true
    },
    module:{
        rules:[
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader','css-loader'],
                test: /\.css$/
            },
            {
                use: [{
                    loader: 'style-loader'
                },{
                    loader: 'css-loader', options:{
                        sourceMap: true
                    }
                },{
                    loader: 'sass-loader',options:{
                        sourceMap: true
                    }
                }],
                test: /\.scss$/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'client/index.html'
        }),
        new LiveReloadPlugin()
    ]
};