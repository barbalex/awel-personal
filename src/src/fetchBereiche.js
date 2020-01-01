export default ({ db, setBereiche }) => {
  const bereiche = db.prepare('SELECT * from bereiche').all()
  setBereiche(bereiche)
}
