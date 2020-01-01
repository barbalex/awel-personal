export default ({ db, setEtiketten }) => {
  const etiketten = db.prepare('SELECT * from etiketten').all()
  setEtiketten(etiketten)
}
