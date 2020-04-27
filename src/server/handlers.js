// see: https://github.com/jlongster/electron-with-server-example
const Database = require('better-sqlite3')

let handlers = {}

handlers._history = []

handlers['getDb'] = async ({ dbPath }) => {
  let db
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    return { error }
  }
  return { result: db }
}

handlers['ring-ring'] = async () => {
  console.log('picking up the phone')
  return 'hello!'
}

module.exports = handlers
