import Database from 'better-sqlite3'

import chooseDb from './chooseDb'

export default async () => {
  let db
  let dbPath = 'C:/Users/alexa/kapla.db'
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    if (error.code === 'SQLITE_CANTOPEN') {
      // await user choose db file
      try {
        dbPath = await chooseDb()
      } catch (chooseError) {
        return console.log('Error after choosing db:', chooseError)
      }
      db = new Database(dbPath, { fileMustExist: true })
    } else {
      return console.log('index.js, Error opening db file:', error)
    }
  }
  return db
}
