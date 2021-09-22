module.exports = {
  // see: https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  // this seems to be to ensure all deps of better-sqlite3 are copied
  packagerConfig: {
    icon: './src/etc/person.png',
    asar: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Personal',
        iconUrl: './src/etc/person.ico',
        copyright: 'AWEL Kt. Zürich, Schweiz',
        owners: 'AWEL Kt. Zürich, Schweiz',
        description: 'Damit verwaltet das AWEL Kt. ZH Personal-Daten',
        authors: 'Alexander Gabriel, Gabriel-Software',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.js',
              name: 'main_window',
            },
          ],
          nodeIntegration: true, // defaults to false
        },
        devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
      },
    ],
    ['@electron-forge/plugin-auto-unpack-natives'],
  ],
}
