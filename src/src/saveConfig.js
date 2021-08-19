// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
import fs from 'fs'
import path from 'path'
import { ipcRenderer } from 'electron'

const saveConfig = async (data) => {
  const userPath = await ipcRenderer.invoke('get-user-data-path')
  const dataFilePath = path.join(userPath, 'awelPersonalConfig.json')
  //console.log('saveConfig, dataFilePath:', dataFilePath)
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

export default saveConfig
