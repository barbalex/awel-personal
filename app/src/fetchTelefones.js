export default ({ db, setTelefones }) => {
  const telefones = db.prepare('SELECT * from telefones').all()
  setTelefones(telefones)
}
