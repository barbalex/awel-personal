export default ({ db, store }) => {
  const telefones = db.prepare('SELECT * from telefones').all()
  store.setTelefones(telefones)
}
