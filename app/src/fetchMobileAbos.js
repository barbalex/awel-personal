export default ({ db, setMobileAbos }) => {
  const mobileAbos = db.prepare('SELECT * from mobileAbos').all()
  setMobileAbos(mobileAbos)
}
