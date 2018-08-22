// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const etiketten = db.prepare('SELECT * from etiketten').all()
  store.setEtiketten(etiketten)
}
