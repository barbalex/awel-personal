export default ({ db, store }) => {
  const bereiche = db.prepare('SELECT * from bereiche').all()
  store.setBereiche(bereiche)
}
