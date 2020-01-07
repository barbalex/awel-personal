export default ({ store }) => {
  const { db, setBereiche } = store
  const bereiche = db.prepare('SELECT * from bereiche').all()
  setBereiche(bereiche)
}
