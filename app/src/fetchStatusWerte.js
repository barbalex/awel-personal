// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const statusWerte = db.prepare('SELECT * from statusWerte').all()
  store.setStatusWerte(statusWerte)
}
