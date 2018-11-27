// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const etiketten = db.prepare('SELECT * from etiketten').all()
  store.setEtiketten(etiketten)
}
