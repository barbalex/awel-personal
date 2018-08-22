// @flow

export default ({ store }: { store: Object }) =>
  store.personen.toJSON().map(p => {
    p.foo = 'foo'
    return p
  })
