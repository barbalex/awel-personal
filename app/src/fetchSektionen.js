// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const sektionen = db.prepare('SELECT * from sektionen').all()
  store.setSektionen(sektionen)
}
