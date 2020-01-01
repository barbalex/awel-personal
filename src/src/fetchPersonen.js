export default ({ db, setPersonen }) => {
  const personen = db.prepare('SELECT * from personen').all()
  setPersonen(personen)
}
