// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const mutations = db.prepare('SELECT * from mutations').all()
  store.setMutations(mutations)
}
