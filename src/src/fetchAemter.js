export default ({ store }) => {
  const { db, setAemter } = store
  const aemter = db.prepare('SELECT * from aemter').all()
  setAemter(aemter)
}
