// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const personen = db.prepare('SELECT * from personen').all()
  store.setPersonen(personen)
}
