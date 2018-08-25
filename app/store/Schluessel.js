import { types } from 'mobx-state-tree'

export default types.model('Schluessel', {
  id: types.integer,
  deleted: types.optional(types.integer, 0),
  idPerson: types.maybe(types.union(types.integer, types.null)),
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  bemerkungen: types.maybe(types.union(types.string, types.integer, types.null))
})
