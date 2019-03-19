export default ({ db, store }) => {
  const anwesenheitstage = db.prepare('SELECT * from anwesenheitstage').all()
  store.setAnwesenheitstage(anwesenheitstage)
}
