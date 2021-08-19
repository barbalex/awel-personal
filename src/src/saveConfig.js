// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
import { ipcRenderer } from 'electron'

const saveConfig = async (data) => {
  await ipcRenderer.invoke('save-config')
  return
}

export default saveConfig
