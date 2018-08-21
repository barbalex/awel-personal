// @flow
import app from 'ampersand-app'

export default (table: string) => {
  const { db, store } = app
  const values = db.prepare(`SELECT * from ${table}`).all()
  store.setWerte({ table, values })
}
