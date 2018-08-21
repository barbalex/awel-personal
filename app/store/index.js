import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

import Person from './Person'
import Etikett from './Etikett'
import StatusWert from './StatusWert'
import GeschlechtWert from './GeschlechtWert'
import AbteilungWert from './AbteilungWert'
import KostenstelleWert from './KostenstelleWert'
import MobileAboTypWert from './MobileAboTypWert'
import KaderFunktionWert from './KaderFunktionWert'
import MobileAboKostenstelleWert from './MobileAboKostenstelleWert'
import TagWert from './TagWert'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

export default types
  .model({
    personen: types.array(Person),
    etiketten: types.array(Etikett),
    statusWerte: types.array(StatusWert),
    geschlechtWerte: types.array(GeschlechtWert),
    abteilungWerte: types.array(AbteilungWert),
    kostenstelleWerte: types.array(KostenstelleWert),
    mobileAboTypWerte: types.array(MobileAboTypWert),
    kaderFunktionWerte: types.array(KaderFunktionWert),
    mobileAboKostenstelleWerte: types.array(MobileAboKostenstelleWert),
    tagWerte: types.array(TagWert),
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
    setEtiketten(etiketten) {
      self.etiketten = etiketten
    },
    setWerte({ table, values }) {
      self[table] = values
    },
    setShowDeleted(show) {
      self.showDeleted = show
    },
    addPerson() {
      // 1. create new Person in db, returning id
      let info
      try {
        info = app.db.prepare('insert into person default values').run()
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.personen.push({ id: info.lastInsertROWID })
      self.setLocation(['Personen', info.lastInsertROWID.toString()])
    },
    setPersonDeleted(id) {
      const personenBefore = self.personen
      self.personen = self.personen.filter(p => p.id !== id)
      // write to db
      try {
        app.db.prepare(`update person set deleted = 1 where id = ?;`).run(id)
      } catch (error) {
        // roll back update
        self.personen = personenBefore
        return console.log(error)
      }
      self.setLocation(['Personen'])
    },
    deletePerson(id) {
      const personenBefore = self.personen
      self.personen = self.personen.filter(p => p.id !== id)
      // write to db
      try {
        app.db.prepare('delete from person where id = ?').run(id)
      } catch (error) {
        // roll back update
        self.personen = personenBefore
        return console.log(error)
      }
      self.setLocation(['Personen'])
    },
    addEtikett(etikett) {
      // grab idPerson from location
      const location = self.location.toJSON()
      const idPerson = ifIsNumericAsNumber(location[1])
      // 1. create new etikett in db, returning id
      let info
      try {
        info = app.db
          .prepare('insert into etikett (idPerson, etikett) values (?, ?)')
          .run(idPerson, etikett)
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.etiketten.push({ id: info.lastInsertROWID, etikett })
    },
    deleteEtikett(etikett) {
      // grab idPerson from location
      const location = self.location.toJSON()
      const activeId = ifIsNumericAsNumber(location[1])
      const etikettenBefore = self.etiketten
      self.etiketten = self.etiketten.filter(
        e => !(e.idPerson === activeId && e.etikett === etikett)
      )
      // write to db
      try {
        app.db
          .prepare('delete from etiketten where id = ? and etikett = ?')
          .run(activeId, etikett)
      } catch (error) {
        // roll back update
        self.etiketten = etikettenBefore
        return console.log(error)
      }
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
