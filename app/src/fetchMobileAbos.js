// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const mobileAbos = db.prepare('SELECT * from mobileAbos').all()
  store.setMobileAbos(mobileAbos)
}
