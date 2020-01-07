export default ({ store }) => {
  const { db, setKaderFunktionen } = store
  const funktionen = db.prepare('SELECT * from kaderFunktionen').all()
  setKaderFunktionen(funktionen)
}
