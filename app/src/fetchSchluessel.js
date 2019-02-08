export default ({ db, store }) => {
  const schluessel = db.prepare('SELECT * from schluessel').all()
  store.setSchluessel(schluessel)
}
