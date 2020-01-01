export default ({ db, setAbteilungen }) => {
  const abteilungen = db.prepare('SELECT * from abteilungen').all()
  setAbteilungen(abteilungen)
}
