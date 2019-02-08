export default ({ db, store }) => {
  const links = db.prepare('SELECT * from links').all()
  store.setLinks(links)
}
