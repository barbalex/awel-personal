import { ipcRenderer } from 'electron'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import saveConfig from './saveConfig'

const chooseDbConnection = async () => {
  const config = await getConfig()
  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  config.dbPath = dbPath
  await saveConfig(config)
  ipcRenderer.invoke('reload-main-window')
}

export default chooseDbConnection
