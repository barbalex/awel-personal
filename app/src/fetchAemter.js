// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const aemter = db.prepare('SELECT * from aemter').all()
  store.setAemter(aemter)
}
