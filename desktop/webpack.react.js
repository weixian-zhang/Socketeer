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
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss)$/,
        use: [{
          // inject CSS to page
          loader: 'style-loader'
        }, {
          // translates CSS into CommonJS modules
          loader: 'css-loader'
        }, {
          // Run postcss actions
          loader: 'postcss-loader',
          options: {
            // `postcssOptions` is needed for postcss 8.x;
            // if you use postcss 7.x skip the key
            postcssOptions: {
              // postcss plugins, can be exported to postcss.config.js
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        }, {
          // compiles Sass to CSS
          loader: 'sass-loader'
        }]
      },
      // {
      //   test: /\.s[ac]ss$/i,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'sass-loader',
      //   ],
      // },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
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