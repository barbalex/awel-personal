export default ({ table, store }) => {
  const { db, setWerte, addError } = store
  let values = []
  try {
    values = db.prepare(`SELECT * from ${table}`).all()
  } catch (error) {
    addError(error)
  }
  values = values.filter((v) => {
    if (v.historic) return v.historic === 0
    return true
  })
  setWerte({ table, values })
}
