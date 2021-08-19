// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'

const getConfig = async () => {
  const userPath = await ipcRenderer.invoke('get-user-data-path')
  const dataFilePath = path.join(userPath, 'awelPersonalConfig.json')
  //console.log('getConfig', { dataFilePath })

  if (!fs.existsSync(dataFilePath)) return {}
  const configFile = fs.readFileSync(dataFilePath, 'utf-8') || {}
  if (!configFile) return {}
  return JSON.parse(configFile)
}

export default getConfig
