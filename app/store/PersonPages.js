import { types } from 'mobx-state-tree'

import PersonPage from './PersonPage'
import Person from './Person'

export default types.model('PersonPage', {
  pages: types.array(PersonPage),
  activePageIndex: types.optional(types.integer, 0),
  remainingRows: types.array(Person),
  building: types.optional(types.boolean, false),
  title: types.optional(types.union(types.string, types.integer), ''),
  showPagesModal: types.optional(types.boolean, false),
  modalTextLine1: types.optional(types.union(types.string, types.integer), ''),
  modalTextLine2: types.optional(types.union(types.string, types.integer), ''),
})
