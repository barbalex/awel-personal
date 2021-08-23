import { ipcRenderer } from 'electron'

import chooseDb from './chooseDb'

const chooseDbConnection = async () => {
  const config = ipcRenderer.invoke('get-config')
  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  config.dbPath = dbPath
  ipcRenderer.invoke('save-config', config)
  ipcRenderer.invoke('reload-main-window')
}

export default chooseDbConnection
