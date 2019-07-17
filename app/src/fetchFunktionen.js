export default ({ db, setFunktionen }) => {
  const funktionen = db.prepare('SELECT * from funktionen').all()
  setFunktionen(funktionen)
}
