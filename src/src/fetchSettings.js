export default ({ db, setSettings }) => {
  const value = db.prepare(`SELECT * from settings where id=?`).get(1)
  setSettings(value)
}
