import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

import AbteilungWert from './AbteilungWert'
import Etikett from './Etikett'
import GeschlechtWert from './GeschlechtWert'
import KaderFunktionWert from './KaderFunktionWert'
import KostenstelleWert from './KostenstelleWert'
import Link from './Link'
import Schluessel from './Schluessel'
import MobileAbo from './MobileAbo'
import KaderFunktion from './KaderFunktion'
import MobileAboKostenstelleWert from './MobileAboKostenstelleWert'
import MobileAboTypWert from './MobileAboTypWert'
import Person from './Person'
import StatusWert from './StatusWert'
import TagWert from './TagWert'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

export default types
  .model({
    abteilungWerte: types.array(AbteilungWert),
    deletionMessage: types.maybeNull(types.string),
    deletionTitle: types.maybeNull(types.string),
    etiketten: types.array(Etikett),
    geschlechtWerte: types.array(GeschlechtWert),
    kaderFunktionWerte: types.array(KaderFunktionWert),
    kostenstelleWerte: types.array(KostenstelleWert),
    links: types.array(Link),
    schluessel: types.array(Schluessel),
    mobileAbos: types.array(MobileAbo),
    kaderFunktionen: types.array(KaderFunktion),
    location: types.optional(types.array(types.string), ['Personen']),
    mobileAboKostenstelleWerte: types.array(MobileAboKostenstelleWert),
    mobileAboTypWerte: types.array(MobileAboTypWert),
    personen: types.array(Person),
    showDeleted: types.optional(types.boolean, false),
    statusWerte: types.array(StatusWert),
    tagWerte: types.array(TagWert)
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
    setLinks(links) {
      self.links = links
    },
    setSchluessel(schluessel) {
      self.schluessel = schluessel
    },
    setMobileAbos(mobileAbos) {
      self.mobileAbos = mobileAbos
    },
    setKaderFunktionen(kaderFunktionen) {
      self.kaderFunktionen = kaderFunktionen
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
        info = app.db.prepare('insert into personen default values').run()
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.personen.push({ id: info.lastInsertROWID })
      self.setLocation(['Personen', info.lastInsertROWID.toString()])
    },
    addWert(table) {
      // 1. create new value in db, returning id
      let info
      try {
        info = app.db.prepare(`insert into ${table} default values`).run()
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self[table].push({ id: info.lastInsertROWID })
      self.setLocation([table, info.lastInsertROWID.toString()])
    },
    setWertDeleted({ id, table }) {
      // write to db
      try {
        app.db.prepare(`update ${table} set deleted = 1 where id = ?;`).run(id)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      const dat = self[table].find(p => p.id === id)
      dat.deleted = 1
      if (!self.showDeleted) self.setLocation([table])
    },
    deleteWert({ id, table }) {
      // write to db
      try {
        app.db.prepare(`delete from ${table} where id = ${id}`).run()
      } catch (error) {
        return console.log(error)
      }
      // write to store
      self[table] = self[table].filter(p => p.id !== id)
      self.setLocation([table])
    },
    setPersonDeleted(id) {
      // write to db
      try {
        app.db.prepare(`update personen set deleted = 1 where id = ?;`).run(id)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      const person = self.personen.find(p => p.id === id)
      person.deleted = 1
      if (!self.showDeleted) self.setLocation(['Personen'])
    },
    deletePerson(id) {
      // write to db
      try {
        app.db.prepare('delete from personen where id = ?').run(id)
      } catch (error) {
        // roll back update
        return console.log(error)
      }
      // write to store
      self.personen = self.personen.filter(p => p.id !== id)
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
          .prepare('insert into etiketten (idPerson, etikett) values (?, ?)')
          .run(idPerson, etikett)
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.etiketten.push({ id: info.lastInsertROWID, etikett, idPerson })
    },
    deleteEtikett(etikett) {
      // grab idPerson from location
      const location = self.location.toJSON()
      const activeId = ifIsNumericAsNumber(location[1])
      // write to db
      try {
        app.db
          .prepare('delete from etiketten where idPerson = ? and etikett = ?')
          .run(activeId, etikett)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      self.etiketten = self.etiketten.filter(
        e => !(e.idPerson === activeId && e.etikett === etikett)
      )
    },
    addLink(url) {
      // grab idPerson from location
      const location = self.location.toJSON()
      const idPerson = ifIsNumericAsNumber(location[1])
      // 1. create new link in db, returning id
      let info
      try {
        info = app.db
          .prepare('insert into links (idPerson, url) values (?, ?)')
          .run(idPerson, url)
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.links.push({ id: info.lastInsertROWID, url, idPerson })
    },
    deleteLink(id) {
      // write to db
      try {
        app.db.prepare('delete from links where id = ?').run(id)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      self.links = self.links.filter(e => !(e.id === id))
    },
    addSchluessel() {
      // grab idPerson from location
      const location = self.location.toJSON()
      const idPerson = ifIsNumericAsNumber(location[1])
      // 1. create new link in db, returning id
      let info
      try {
        info = app.db
          .prepare('insert into schluessel (idPerson) values (?)')
          .run(idPerson)
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.schluessel.push({ id: info.lastInsertROWID })
    },
    deleteSchluessel(id) {
      // write to db
      try {
        app.db.prepare('delete from schluessel where id = ?').run(id)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      self.schluessel = self.schluessel.filter(e => !(e.id === id))
    },
    addMobileAbo() {
      // grab idPerson from location
      const location = self.location.toJSON()
      const idPerson = ifIsNumericAsNumber(location[1])
      // 1. create new link in db, returning id
      let info
      try {
        info = app.db
          .prepare('insert into mobileAbos (idPerson) values (?)')
          .run(idPerson)
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.mobileAbos.push({ id: info.lastInsertROWID })
    },
    deleteMobileAbo(id) {
      // write to db
      try {
        app.db.prepare('delete from mobileAbos where id = ?').run(id)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      self.mobileAbos = self.mobileAbos.filter(e => !(e.id === id))
    },
    addKaderFunktion() {
      // grab idPerson from location
      const location = self.location.toJSON()
      const idPerson = ifIsNumericAsNumber(location[1])
      // 1. create new link in db, returning id
      let info
      try {
        info = app.db
          .prepare('insert into kaderFunktionen (idPerson) values (?)')
          .run(idPerson)
      } catch (error) {
        return console.log(error)
      }
      // 2. add to store
      self.kaderFunktionen.push({ id: info.lastInsertROWID })
    },
    deleteKaderFunktion(id) {
      // write to db
      try {
        app.db.prepare('delete from kaderFunktionen where id = ?').run(id)
      } catch (error) {
        return console.log(error)
      }
      // write to store
      self.kaderFunktionen = self.kaderFunktionen.filter(e => !(e.id === id))
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
