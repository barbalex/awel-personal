// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const mobileAbos = db.prepare('SELECT * from mobileAbos').all()
  store.setMobileAbos(mobileAbos)
}
