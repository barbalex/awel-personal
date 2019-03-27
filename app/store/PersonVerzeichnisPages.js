import { types, getParent } from 'mobx-state-tree'

import PersonVerzeichnisPage, {
  standard as standardPage,
} from './PersonVerzeichnisPage'

export default types
  .model('PersonVerzeichnisPages', {
    pages: types.array(PersonVerzeichnisPage),
    activePageIndex: types.optional(types.integer, 0),
    remainingRows: types.array(types.integer),
    building: types.optional(types.boolean, false),
  })
  .actions(self => ({
    reset() {
      self.pages = []
      self.activePageIndex = 0
      self.remainingRows = []
      self.building = false
    },
    initiate() {
      const store = getParent(self, 1)
      const { personenFiltered } = store
      self.reset()
      self.remainingRows = personenFiltered.map(p => p.id)
      self.building = true
      self.pages.push(standardPage)
    },
    setRemainingRows(rows) {
      self.remainingRows = rows
    },
    newPage() {
      self.activePageIndex += 1
      self.pages.push(standardPage)
    },
    addRow() {
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.addRow(self.remainingRows.shift())
      }
    },
    moveRowToNewPage() {
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      activePage.full = true
      self.remainingRows.unshift(activePage.rows.pop())
      self.newPage()
      self.addRow()
    },
    stop() {
      self.building = false
    },
  }))
  .views(self => ({
    get modal() {
      const store = getParent(self, 1)
      const msgLine2Txt = `Bisher ${self.pages.length} Seiten, noch ${
        self.remainingRows.length
      } Personen zu verarbeiten`
      const textLine2 = store.personenFiltered.length > 50 ? msgLine2Txt : ''

      return {
        textLine1: 'Der Bericht wird aufgebaut...',
        textLine2,
      }
    },
  }))
