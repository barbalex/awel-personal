export default ({ db, setMutations }) => {
  const mutations = db.prepare('SELECT * from mutations').all()
  setMutations(mutations)
}
