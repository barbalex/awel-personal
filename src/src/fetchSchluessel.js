export default ({ store }) => {
  const { db, setSchluessel } = store
  const schluessel = db.prepare('SELECT * from schluessel').all()
  setSchluessel(schluessel)
}
