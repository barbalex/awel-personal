import { types, getParent } from 'mobx-state-tree'

import PersonVerzeichnisColumn from './PersonVerzeichnisColumn'

export default types
  .model('PersonVerzeichnisPage', {
    column0: types.array(PersonVerzeichnisColumn),
    column1: types.array(PersonVerzeichnisColumn),
    column2: types.array(PersonVerzeichnisColumn),
    activeColumnIndex: types.optional(types.integer, 0),
    full: types.optional(types.boolean, false),
  })
  .actions(self => ({
    addRow(row) {
      self[`column${self.activeColumnIndex}`].addRow(row)
    },
    moveRowToNewColumn() {
      const pages = getParent(self, 1)
      const activeColumn = self[`column${self.activeColumnIndex}`]
      activeColumn.setFull()
      pages.remainingRows.unshift(activeColumn.rows.pop())
      if (activeColumn < 2) {
        self.activeColumnIndex += 1
      } else {
        self.setFull()
        pages.newPage()
      }
      pages.addRow()
    },
    setFull() {
      self.full = true
    },
  }))
