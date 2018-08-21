import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

import Person from './Person'
import StatusWert from './StatusWert'
import GeschlechtWert from './GeschlechtWert'

export default types
  .model({
    personen: types.array(Person),
    statusWerte: types.array(StatusWert),
    geschlechtWerte: types.array(GeschlechtWert),
    location: types.optional(types.array(types.string), ['Personen']),
    showDeleted: types.optional(types.boolean, false),
    deletionTitle: types.maybeNull(types.string),
    deletionMessage: types.maybeNull(types.string)
  })
  // functions are not serializable
  // so need to define this as volatile
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
    setWerte({ table, values }) {
      self[table] = values
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
    },
    updateField({ table, parentModel, field, value, id }) {
      try {
        app.db
          .prepare(`update ${table} set ${field} = @value where id = @id;`)
          .run({
            value,
            id
          })
      } catch (error) {
        return console.log(error)
      }
      const storeObject = self[parentModel].find(o => o.id === id)
      if (!storeObject) {
        return console.log(`Error: no ${table} with id "${id}" found in store`)
      }
      storeObject[field] = value
    }
  }))
