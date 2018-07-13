import { types } from 'mobx-state-tree'

export default types
  .model('Config', {
    dbPath: types.string
  })
  .recordActions(self => ({
    setDbPath(path) {
      self.dbPath = path
    }
  }))
