export default ({ table, store }) => {
  const { db, setWerte, addError } = store
  let values = []
  try {
    values = db.prepare(`SELECT * from ${table}`).all()
  } catch (error) {
    addError(error)
  }
  setWerte({ table, values })
}
