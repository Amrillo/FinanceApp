const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  devtool: 'inline-source-map',
  devServer: {  
    static: ".docs",
    compress: true,
    port: 9000, 
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
    clean: true
  },
  plugins: [
    new htmlWebpackPlugin( {  
      title: 'Development',
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
      { from: "src/templates", to: "templates" },
      { from: "src/styles", to: "styles" },
      { from: "src/static/fonts", to: "fonts" },
      { from: "src/static/images", to: "images" }
      ]})
  ],
   module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {  
            test: /\.css$/,
             use: ['style-loader', 'css-loader']
          },
        ]
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
      externals: {
        moment: 'moment'
    }
};