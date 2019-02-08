export default ({ db, store }) => {
  const value = db.prepare(`SELECT * from settings where id=?`).get(1)
  store.setSettings(value)
}
