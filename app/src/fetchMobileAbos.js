export default ({ db, store }) => {
  const mobileAbos = db.prepare('SELECT * from mobileAbos').all()
  store.setMobileAbos(mobileAbos)
}
