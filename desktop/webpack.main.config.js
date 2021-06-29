const plugins = require('./webpack.plugins');


module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main-process/electron.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
    // mainFields: ['module', 'browser', 'main'],
    // alias: Object.keys(tsconfig.compilerOptions.paths).reduce((aliases, aliasName) => {

    //   aliases[aliasName] = path.resolve(__dirname, `src/${tsconfig.compilerOptions.paths[aliasName][0]}`)

    //   return aliases
    // }, {})
  },
  plugins: plugins
};