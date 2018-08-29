import { types } from 'mobx-state-tree'

export default types.model('Mutation', {
  id: types.integer,
  time: types.maybe(types.union(types.string, types.integer, types.null)),
  user: types.maybe(types.union(types.string, types.integer, types.null)),
  model: types.maybe(types.union(types.string, types.integer, types.null)),
  op: types.maybe(types.union(types.string, types.integer, types.null)),
  path: types.maybe(types.union(types.string, types.integer, types.null)),
  value: types.maybe(types.union(types.string, types.integer, types.null))
})
