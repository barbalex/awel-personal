// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const kaderFunktionen = db.prepare('SELECT * from kaderFunktionen').all()
  store.setKaderFunktionen(kaderFunktionen)
}
