// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const etiketten = db.prepare('SELECT * from etikett').all()
  store.setEtiketten(etiketten)
}
