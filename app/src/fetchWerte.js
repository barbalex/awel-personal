export default ({ table, db, store }) => {
  const values = db.prepare(`SELECT * from ${table}`).all()
  store.setWerte({ table, values })
}
