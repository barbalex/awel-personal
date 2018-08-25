// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const kaderFunktionen = db.prepare('SELECT * from kaderFunktionen').all()
  store.setKaderFunktionen(kaderFunktionen)
}
