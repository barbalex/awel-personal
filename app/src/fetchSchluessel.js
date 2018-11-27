// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const schluessel = db.prepare('SELECT * from schluessel').all()
  store.setSchluessel(schluessel)
}
