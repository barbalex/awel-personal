export default ({ db, store }) => {
  const mutations = db.prepare('SELECT * from mutations').all()
  store.setMutations(mutations)
}
