import Database from 'better-sqlite3'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import saveConfig from './saveConfig'

export default async () => {
  const config = getConfig()
  let dbPath = config.dbPath || 'C:/Users/alexa/kapla.db'
  let db
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    if (error.code === 'SQLITE_CANTOPEN') {
      // user needs to choose db file
      try {
        dbPath = await chooseDb()
      } catch (chooseError) {
        return console.log('Error after choosing db:', chooseError)
      }
      db = new Database(dbPath, { fileMustExist: true })
      config.dbPath = dbPath
      saveConfig(config)
    } else {
      return console.log('index.js, Error opening db file:', error)
    }
  }
  return db
}
