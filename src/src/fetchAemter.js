export default ({ store }) => {
  const { db, setAemter, addError } = store
  let aemter = []
  try {
    aemter = db.prepare('SELECT * from aemter').all()
  } catch (error) {
    addError(error)
  }
  setAemter(aemter)
}
