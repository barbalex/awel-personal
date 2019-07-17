export default ({ table, db, setWerte }) => {
  const values = db.prepare(`SELECT * from ${table}`).all()
  setWerte({ table, values })
}
