export default ({ db, setAnwesenheitstage }) => {
  const anwesenheitstage = db.prepare('SELECT * from anwesenheitstage').all()
  setAnwesenheitstage(anwesenheitstage)
}
