export default ({ db, setSektionen }) => {
  const sektionen = db.prepare('SELECT * from sektionen').all()
  setSektionen(sektionen)
}
