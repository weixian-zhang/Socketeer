const path = require('path');

module.exports = {
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/main.ts',
  target: 'electron-main',
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{ loader: 'ts-loader' }]
    }]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  }
}

// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default electronConfigs = {
//   // Build Mode
//   mode: 'development',
//   // Electron Entrypoint
//   entry: 'src/main.ts',
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
//     path: __dirname + '/dist/src',
//     filename: 'main.js'
//   }
// }