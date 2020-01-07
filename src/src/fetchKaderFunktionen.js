export default ({ store }) => {
  const { db, setKaderFunktionen, addError } = store
  let funktionen = []
  try {
    funktionen = db.prepare('SELECT * from kaderFunktionen').all()
  } catch (error) {
    addError(error)
  }
  setKaderFunktionen(funktionen)
}
