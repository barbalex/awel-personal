import { ipcRenderer } from 'electron'

import chooseDb from './chooseDb'

const chooseDbConnection = async () => {
  const config = await ipcRenderer.invoke('get-config')
  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  config.dbPath = dbPath
  await ipcRenderer.invoke('save-config')
  ipcRenderer.invoke('reload-main-window')
}

export default chooseDbConnection
