export default ({ table, store }) => {
  const { db, setWerte } = store
  const values = db.prepare(`SELECT * from ${table}`).all()
  setWerte({ table, values })
}
