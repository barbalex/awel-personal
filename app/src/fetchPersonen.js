// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const personen = db.prepare('SELECT * from person').all()
  store.setPersonen(personen)
}
