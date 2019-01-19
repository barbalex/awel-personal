import { types } from 'mobx-state-tree'

export default types.model('Amt', {
  id: types.maybe(types.integer),
  deleted: types.optional(types.integer, 0),
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  kurzzeichen: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  telefonNr: types.maybe(types.union(types.string, types.integer, types.null)),
  email: types.maybe(types.union(types.string, types.integer, types.null)),
  standort: types.maybe(types.union(types.string, types.integer, types.null)),
  leiter: types.maybeNull(types.integer),
  kostenstelle: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  letzteMutationZeit: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  letzteMutationUser: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
})
