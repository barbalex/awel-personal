export default ({ db, store }) => {
  const aemter = db.prepare('SELECT * from aemter').all()
  store.setAemter(aemter)
}
