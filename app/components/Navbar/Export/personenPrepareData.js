// @flow

// TODO: add filter
// TODO: add data referenced data
// TODO: only show deleted if showDeleted
export default ({ store }: { store: Object }) =>
  store.personenFiltered.slice().map(p => p)
