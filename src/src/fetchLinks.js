export default ({ store }) => {
  const { db, setLinks } = store
  const links = db.prepare('SELECT * from links').all()
  setLinks(links)
}
