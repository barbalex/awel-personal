export default ({ db, setAemter }) => {
  const aemter = db.prepare('SELECT * from aemter').all()
  setAemter(aemter)
}
