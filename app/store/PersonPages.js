import { types, getParent } from 'mobx-state-tree'

import PersonPage from './PersonPage'
import Person from './Person'

export default types
  .model('PersonPage', {
    pages: types.array(PersonPage),
    activePageIndex: types.optional(types.integer, 0),
    remainingRows: types.array(Person),
    building: types.optional(types.boolean, false),
    title: types.optional(types.union(types.string, types.integer), ''),
  })
  .actions(self => ({
    reset() {
      self.pages = []
      self.activePageIndex = 0
      self.remainingRows = []
      self.building = false
      self.title = ''
    },
    initiate() {
      const store = getParent(self, 1)
      self.reset()
      self.remainingRows = [...store.personenFiltered]
      self.building = true
    },
    setTitle(val) {
      self.title = val
    },
    setRemainingRows(rows) {
      self.remainingRows = rows
    },
    newPage() {
      self.activePageIndex += 1
      self.pages.push({ rows: [], full: false })
    },
    addRow() {
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.rows.push(self.remainingRows.shift())
      }
    },
    moveRowToNewPage() {
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.full = true
        self.remainingRows.unshift(activePage.rows.pop())
        self.newPage()
        self.addRow()
      }
    },
    stop() {
      self.building = false
    },
  }))
  .views(self => ({
    get modal() {
      if (!self.building) return null

      const store = getParent(self, 1)
      const msgLine2Txt = `Bisher ${self.pages.length} Seiten, ${
        self.remainingRows.length
      } Geschäfte noch zu verarbeiten`
      const textLine2 = store.personenFiltered.length > 50 ? msgLine2Txt : ''
      return {
        textLine1: 'Der Bericht wird aufgebaut...',
        textLine2,
      }
    },
  }))
