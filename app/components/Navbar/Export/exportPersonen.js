// @flow

export default ({ store }: { store: Object }) => {
  // TODO
  const personenReadable = store.personen.toJSON().map(p => {
    p.foo = 'foo'
    return p
  })
}
