export default ({ db, store }) => {
  const personen = db.prepare('SELECT * from personen').all()
  store.setPersonen(personen)
}
