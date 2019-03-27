import { types } from 'mobx-state-tree'

export default types
  .model('PersonVerzeichnisColumn', {
    rows: types.array(types.integer),
    full: types.optional(types.boolean, false),
  })
  .actions(self => ({
    addRow(row) {
      self.rows.push(row)
    },
    setFull() {
      self.full = true
    },
  }))

export const standard = { rows: [], full: false }
