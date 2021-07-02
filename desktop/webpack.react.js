const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/renderer/renderer.tsx',
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist/src/renderer.js'),
    compress: true,
    port: 3000
  },
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default  reactConfigs = {
//   mode: 'development',
//   entry: './src/renderer.tsx',
//   target: 'electron-renderer',
//   devtool: 'source-map',
//   devServer: {
//     contentBase: path.join(__dirname, 'dist/src/renderer.js'),
//     compress: true,
//     port: 3000
//   },
//   resolve: {
//     alias: {
//       ['@']: path.resolve(__dirname, 'src')
//     },
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts(x?)$/,
//         include: /src/,
//         use: [{ loader: 'ts-loader' }]
//       },
//       {
//         test: /\.s[ac]ss$/i,
//         use: [
//           'style-loader',
//           'css-loader',
//           'sass-loader',
//         ],
//       }
//     ]
//   },
//   output: {
//     path: __dirname + '/dist/src/',
//     filename: 'renderer.js',
//     devtoolModuleFilenameTemplate: '[absolute-resource-path]'
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/index.html'
//     })
//   ]
// };