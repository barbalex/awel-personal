import { types } from 'mobx-state-tree'

export default types
  .model('Config', {
    dbPath: types.string
  })
  .actions(self => ({
    setDbPath(path) {
      self.dbPath = path
    }
  }))
