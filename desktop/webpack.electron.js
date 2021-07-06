const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/main/main.ts',
  devtool: 'inline-source-map',
  target: 'electron-main',
  devServer: {
    // contentBase: path.join(__dirname, 'dist/index.html'),
    historyApiFallback: true,
    port: 3100
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
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
        exclude: /node_modules/,
      }
      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3'
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^fsevents$/,
    })
  ]
}