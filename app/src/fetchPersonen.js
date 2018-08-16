// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const personen = db.prepare('SELECT * from person').all()
  console.log('fetchPersonen:', { personen, store })
  store.setPersonen(personen)
}
