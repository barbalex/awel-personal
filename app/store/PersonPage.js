import { types } from 'mobx-state-tree'

import Person from './Person'

export default types.model('PersonPage', {
  rows: types.array(Person),
  full: types.optional(types.boolean, false),
})
