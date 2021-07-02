const electronConfigs = require('./webpack.electron.js');
const reactConfigs = require('./webpack.react.js');

module.exports = [
  electronConfigs,
  reactConfigs
];

// import {electronConfigs} from './webpack.electron.js';
// import {reactConfigs} from './webpack.react.js';

// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import HtmlWebpackPlugin from 'html-webpack-plugin';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const electronConfigs = {
//   // Build Mode
//   mode: 'development',
//   // Electron Entrypoint
//   entry: './src/main.ts',
//   target: 'electron-main',
//   resolve: {
//     alias: {
//       ['@']: path.resolve(__dirname, 'src')
//     },
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   module: {
//     rules: [{
//       test: /\.ts$/,
//       include: /src/,
//       use: [{ loader: 'ts-loader' }]
//     }]
//   },
//   output: {
//     path: __dirname + '/dist',
//     filename: 'main.js'
//   }
// }

// const reactConfigs = {
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
//     filename: 'renderer.js'
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/index.html'
//     })
//   ]
// };

// export default [
//   electronConfigs,
//   reactConfigs
// ];