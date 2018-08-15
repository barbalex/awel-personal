import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

import Person from './Person'

const { db } = app

export default types
  .model({
    personen: types.array(Person)
  })
  .actions(self => ({
    addPerson() {
      // 1. create new Person in db, returning id
      let info
      try {
        info = db.prepare('insert into person default values').run()
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.personen.unshift({ id: info.lastInsertROWID })
    },
    deletePerson(id) {
      const personenBefore = self.personen
      self.personen = self.personen.filter(p => p.id !== id)
      // write to db
      try {
        db.prepare('delete from person where id = ?').run(id)
      } catch (error) {
        // roll back update
        self.personen = personenBefore
        return console.log(error)
      }
    }
  }))
