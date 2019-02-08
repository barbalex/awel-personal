export default ({ db, store }) => {
  const sektionen = db.prepare('SELECT * from sektionen').all()
  store.setSektionen(sektionen)
}
