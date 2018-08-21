import { types } from 'mobx-state-tree'

export default types.model('KostenstelleWert', {
  id: types.integer,
  value: types.maybeNull(types.union(types.string, types.integer)),
  deleted: types.optional(types.integer, 0),
  historic: types.optional(types.integer, 0),
  sort: types.maybeNull(types.integer)
})
