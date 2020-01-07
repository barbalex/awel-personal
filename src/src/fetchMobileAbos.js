export default ({ store }) => {
  const { db, setMobileAbos } = store
  const mobileAbos = db.prepare('SELECT * from mobileAbos').all()
  setMobileAbos(mobileAbos)
}
