import { types } from 'mobx-state-tree'

export default types.model('Etikett', {
  id: types.maybe(types.integer),
  deleted: types.optional(types.integer, 0),
  idPerson: types.maybe(types.union(types.integer, types.null)),
  etikett: types.maybe(types.union(types.string, types.integer, types.null))
})
