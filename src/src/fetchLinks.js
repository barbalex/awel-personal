export default ({ store }) => {
  const { db, setLinks, addError } = store
  let links = []
  try {
    links = db.prepare('SELECT * from links').all()
  } catch (error) {
    addError(error)
  }
  setLinks(links)
}
