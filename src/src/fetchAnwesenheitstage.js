export default ({ store }) => {
  const { db, setAnwesenheitstage } = store
  const anwesenheitstage = db.prepare('SELECT * from anwesenheitstage').all()
  setAnwesenheitstage(anwesenheitstage)
}
