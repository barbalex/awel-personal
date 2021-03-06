import Database from 'better-sqlite3'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import saveConfig from './saveConfig'

const getDb = async (store) => {
  const config = getConfig()
  //console.log('getDb, config:', config)
  let dbPath = config.dbPath || 'C:/Users/alexa/personal.db'

  let db
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    if (
      (error.code && error.code === 'SQLITE_CANTOPEN') ||
      error.message.includes('directory does not exist')
    ) {
      // user needs to choose db file
      try {
        dbPath = await chooseDb()
      } catch (chooseError) {
        store.addError(chooseError)
        return console.log('Error after choosing db:', chooseError)
      }
      db = new Database(dbPath, { fileMustExist: true })
      config.dbPath = dbPath
      saveConfig(config)
    } else {
      store.addError(error)
      return console.log('index.js, Error opening db file:', error)
    }
  }
  return db
}

export default getDb
