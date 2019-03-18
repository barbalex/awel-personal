export default ({ db, store }) => {
  const funktionen = db.prepare('SELECT * from kaderFunktionen').all()
  store.setKaderFunktionen(funktionen)
}
