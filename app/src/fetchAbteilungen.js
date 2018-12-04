// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const abteilungen = db.prepare('SELECT * from abteilungen').all()
  store.setAbteilungen(abteilungen)
}
