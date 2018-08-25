// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const schluessel = db.prepare('SELECT * from schluessel').all()
  store.setSchluessel(schluessel)
}
