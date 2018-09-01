// @flow

// TODO: add data referenced data
export default ({ store }: { store: Object }) =>
  store.personenFiltered.slice().map(p => p)
