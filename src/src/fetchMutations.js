export default ({ store }) => {
  const { db, setMutations } = store
  const mutations = db.prepare('SELECT * from mutations').all()
  setMutations(mutations)
}
