import { types } from 'mobx-state-tree'

export default types.model('Settings', {
  id: types.integer,
  schluesselFormPath: types.union(types.string, types.null),
})
