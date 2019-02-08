export default ({ db, store }) => {
  const funktionen = db.prepare('SELECT * from funktionen').all()
  store.setFunktionen(funktionen)
}
