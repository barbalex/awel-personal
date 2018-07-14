// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
import electron from 'electron'
import fs from 'fs'
import path from 'path'

const { app } = electron.remote
const dataFilePath = path.join(
  app.getPath('userData'),
  'awelPersonalConfig.json'
)

export default () => {
  if (!fs.existsSync(dataFilePath)) return {}
  const configFile = fs.readFileSync(dataFilePath, 'utf-8') || {}
  if (!configFile) return {}
  return JSON.parse(configFile)
}
