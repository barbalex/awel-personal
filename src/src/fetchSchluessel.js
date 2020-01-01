export default ({ db, setSchluessel }) => {
  const schluessel = db.prepare('SELECT * from schluessel').all()
  setSchluessel(schluessel)
}
