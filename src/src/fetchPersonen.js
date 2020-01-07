export default ({ store }) => {
  const { db, setPersonen } = store
  const personen = db.prepare('SELECT * from personen').all()
  setPersonen(personen)
}
