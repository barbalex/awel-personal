// @flow
export default ({ db, store }: { db: Object, store: Object }) => {
  const telefones = db.prepare('SELECT * from telefones').all()
  store.setTelefones(telefones)
}
