// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
import { ipcRenderer } from 'electron'

const getConfig = async () => {
  const config = await ipcRenderer.invoke('get-config')
  return config
}

export default getConfig
