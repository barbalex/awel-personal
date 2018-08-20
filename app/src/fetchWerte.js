// @flow
import app from 'ampersand-app'

export default (table: string) => {
  const { db, store } = app
  const statusWerte = db.prepare('SELECT * from ?').all(table)
  store.setWerte({ table, values: statusWerte })
}
