// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const value = db.prepare(`SELECT * from settings where id=?`).get(1)
  store.setSettings(value)
}
