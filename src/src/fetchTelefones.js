export default ({ store }) => {
  const { db, setTelefones } = store
  const telefones = db.prepare('SELECT * from telefones').all()
  setTelefones(telefones)
}
