export default ({ db, setKaderFunktionen }) => {
  const funktionen = db.prepare('SELECT * from kaderFunktionen').all()
  setKaderFunktionen(funktionen)
}
