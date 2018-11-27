// @flow
export default ({
  table,
  db,
  store
}: {
  table: string,
  db: Object,
  store: Object
}) => {
  const values = db.prepare(`SELECT * from ${table}`).all()
  store.setWerte({ table, values })
}
