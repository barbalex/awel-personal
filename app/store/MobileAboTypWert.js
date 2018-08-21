import { types } from 'mobx-state-tree'

export default types.model('MobileAboTypWert', {
  id: types.integer,
  value: types.union(types.string, types.integer, types.null),
  deleted: types.optional(types.integer, 0),
  historic: types.optional(types.integer, 0),
  sort: types.maybeNull(types.integer)
})
