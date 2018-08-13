import { types } from 'mobx-state-tree'

export default types
  .model('Db', {
    db: types.string
  })
  .actions(self => ({
    setDb(db) {
      self.db = db
    }
  }))
