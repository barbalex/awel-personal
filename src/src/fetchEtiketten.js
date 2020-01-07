export default ({ store }) => {
  const { db, setEtiketten } = store
  const etiketten = db.prepare('SELECT * from etiketten').all()
  setEtiketten(etiketten)
}
