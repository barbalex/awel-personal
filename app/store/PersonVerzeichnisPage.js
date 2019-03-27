import { types, getParent, getSnapshot } from 'mobx-state-tree'

import PersonVerzeichnisColumn, {
  standard as standardColumn,
} from './PersonVerzeichnisColumn'

export default types
  .model('PersonVerzeichnisPage', {
    column0: PersonVerzeichnisColumn,
    column1: PersonVerzeichnisColumn,
    column2: PersonVerzeichnisColumn,
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
      console.log('store, PersonVerzeichnisPage', {
        column0: getSnapshot(self.column0),
        activeColumn: getSnapshot(activeColumn),
        pages: getSnapshot(pages),
        activeColumnIndex: self.activeColumnIndex,
      })
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

export const standard = {
  column0: standardColumn,
  column1: standardColumn,
  column2: standardColumn,
  activeColumnIndex: 0,
  full: false,
}
