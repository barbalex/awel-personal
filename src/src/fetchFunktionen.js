export default ({ store }) => {
  const { db, setFunktionen } = store
  const funktionen = db.prepare('SELECT * from funktionen').all()
  setFunktionen(funktionen)
}
