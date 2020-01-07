export default ({ store }) => {
  const { db, setSektionen } = store
  const sektionen = db.prepare('SELECT * from sektionen').all()
  setSektionen(sektionen)
}
