import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

import Person from './Person'

export default types
  .model({
    personen: types.array(Person),
    location: types.optional(types.array(types.string), ['Personen']),
    showDeleted: types.optional(types.boolean, false),
    deletionTitle: types.maybeNull(types.string),
    deletionMessage: types.maybeNull(types.string)
  })
  .volatile(() => ({
    deletionCallback: null
  }))
  .actions(self => ({
    setDeletionCallback(callback) {
      self.deletionCallback = callback
    },
    setDeletionTitle(title) {
      self.deletionTitle = title
    },
    setDeletionMessage(message) {
      self.deletionMessage = message
    },
    setLocation(location) {
      self.location = location
    },
    setPersonen(personen) {
      self.personen = personen
    },
    setShowDeleted(show) {
      self.showDeleted = show
    },
    addPerson() {
      const { db } = app
      // 1. create new Person in db, returning id
      let info
      try {
        info = db.prepare('insert into person default values').run()
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.personen.push({ id: info.lastInsertROWID })
      self.setLocation(['Personen', info.lastInsertROWID.toString()])
    },
    setPersonDeleted(id) {
      const { db } = app
      const personenBefore = self.personen
      self.personen = self.personen.filter(p => p.id !== id)
      // write to db
      try {
        db.prepare(`update person set deleted = 1 where id = ?;`).run(id)
      } catch (error) {
        // roll back update
        self.personen = personenBefore
        return console.log(error)
      }
      self.setLocation(['Personen'])
    },
    deletePerson(id) {
      const { db } = app
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
      self.setLocation(['Personen'])
    }
  }))
