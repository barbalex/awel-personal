export default ({ store }) => {
  const { db, setAbteilungen } = store
  const abteilungen = db.prepare('SELECT * from abteilungen').all()
  setAbteilungen(abteilungen)
}
