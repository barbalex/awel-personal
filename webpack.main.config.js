const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: ['@babel/polyfill', './src/main.js'],
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    // dont know why but now have to copy image
    new CopyPlugin({
      patterns: [
        {
          from: './src/etc/person.png',
          to: './src/etc/person.png',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
}
