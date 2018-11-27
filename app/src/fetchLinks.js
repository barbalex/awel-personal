// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const links = db.prepare('SELECT * from links').all()
  store.setLinks(links)
}
