// @flow
import app from 'ampersand-app'

export default () => {
  const { db, store } = app
  const mutations = db.prepare('SELECT * from mutations').all()
  store.setMutations(mutations)
}
