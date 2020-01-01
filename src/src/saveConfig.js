// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
import electron from 'electron'
import fs from 'fs'
import path from 'path'

const { app } = electron.remote

const dataFilePath = path.join(
  app.getPath('userData'),
  'awelPersonalConfig.json',
)

//console.log('saveConfig, dataFilePath:', dataFilePath)

export default data =>
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
