export default ({ store }) => {
  const { db, setSettings } = store
  const value = db.prepare(`SELECT * from settings where id=?`).get(1)
  setSettings(value)
}
