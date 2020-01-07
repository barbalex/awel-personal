export default ({ store }) => {
  const { db, setSettings, addError } = store
  let value = {}
  try {
    value = db.prepare(`SELECT * from settings where id=?`).get(1)
  } catch (error) {
    return addError(error)
  }
  setSettings(value)
}
