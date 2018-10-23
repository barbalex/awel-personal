import Database from 'better-sqlite3'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import saveConfig from './saveConfig'

export default async () => {
  const config = getConfig()
  console.log('getDbConnection, config', config)
  let dbPath = config.dbPath || 'C:/Users/alexa/personal.db'
  console.log('getDbConnection, dbPath', dbPath)
  let db
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    console.log('getDbConnection, error', error)
    console.log('getDbConnection, error.code', error.message)
    if (
      (error.code && error.code === 'SQLITE_CANTOPEN') ||
      error.message.includes('directory does not exist')
    ) {
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
  console.log('getDbConnection, db', db)
  return db
}
