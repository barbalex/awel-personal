// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const links = db.prepare('SELECT * from links').all()
  store.setLinks(links)
}
