export default ({ db, store }) => {
  const etiketten = db.prepare('SELECT * from etiketten').all()
  store.setEtiketten(etiketten)
}
