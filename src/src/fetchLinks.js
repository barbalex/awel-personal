export default ({ db, setLinks }) => {
  const links = db.prepare('SELECT * from links').all()
  setLinks(links)
}
