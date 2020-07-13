const CopyPlugin = require('copy-webpack-plugin')

const rules = require('./webpack.rules')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  // declare better-sqlite3 external and copy all of it
  // see https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  // and https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544204354
  // and https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  // 2020.07.13: try this: https://github.com/electron-userland/electron-forge/issues/1451#issuecomment-606039498
  externals: [
    function (context, request, callback) {
      if (['better-sqlite3'].includes(request)) {
        return callback(null, 'commonjs ' + request)
      }
      callback()
    },
  ],
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/etc/person.png',
          to: './src/etc/person.png', // still under node_modules directory so it could find this module
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
}
