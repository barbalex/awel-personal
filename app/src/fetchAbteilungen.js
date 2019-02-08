export default ({ db, store }) => {
  const abteilungen = db.prepare('SELECT * from abteilungen').all()
  store.setAbteilungen(abteilungen)
}
