// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const funktionen = db.prepare('SELECT * from funktionen').all()
  store.setFunktionen(funktionen)
}
