import { types, splitJsonPath } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import app from 'ampersand-app'
import findIndex from 'lodash/findIndex'
import flatten from 'lodash/flatten'
import findLast from 'lodash/findLast'
import keys from 'lodash/keys'
import lValues from 'lodash/values'

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
import EtikettWert from './EtikettWert'
import Person from './Person'
import Mutation from './Mutation'
import StatusWert from './StatusWert'
import TagWert from './TagWert'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

const myTypes = types
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
    mobileAboKostenstelleWerte: types.array(MobileAboKostenstelleWert),
    mobileAboTypWerte: types.array(MobileAboTypWert),
    etikettWerte: types.array(EtikettWert),
    personen: types.array(Person),
    mutations: types.array(Mutation),
    location: types.optional(types.array(types.string), ['Personen']),
    showDeleted: types.optional(types.boolean, false),
    statusWerte: types.array(StatusWert),
    tagWerte: types.array(TagWert),
    username: types.maybe(types.string),
    watchMutations: types.optional(types.boolean, false),
    history: types.optional(UndoManager, {}),
    filterPerson: types.optional(Person, {}),
    filterEtikett: types.optional(Etikett, {}),
    filterLink: types.optional(Link, {}),
    filterSchluessel: types.optional(Schluessel, {}),
    filterMobileAbo: types.optional(MobileAbo, {}),
    filterKaderFunktion: types.optional(KaderFunktion, {}),
    showFilter: types.optional(types.boolean, false),
    filterFulltext: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
  })
  .views(self => ({
    get existsFilter() {
      const {
        filterPerson,
        filterEtikett,
        filterLink,
        filterSchluessel,
        filterMobileAbo,
        filterKaderFunktion,
      } = self
      return (
        [
          ...Object.values(filterPerson),
          ...Object.values(filterEtikett),
          ...Object.values(filterLink),
          ...Object.values(filterSchluessel),
          ...Object.values(filterMobileAbo),
          ...Object.values(filterKaderFunktion),
        ].filter(v => v).length > 0
      )
    },
    get personenFiltered() {
      const {
        filterSchluessel,
        filterMobileAbo,
        filterKaderFunktion,
        filterEtikett,
        filterPerson,
      } = self
      let {personen} = self
      Object.keys(filterPerson).forEach(key => {
        if (filterPerson[key] || filterPerson[key] === 0) {
          personen = personen.filter(p => {
            if (!filterPerson[key]) return true
            if (!p[key]) return false
            return p[key]
              .toString()
              .toLowerCase()
              .includes(filterPerson[key].toString().toLowerCase())
          })
        }
      })
      let schluessel = self.schluessel.filter(p => {
        if (!self.showDeleted) return p.deleted === 0
        return true
      })
      let schluesselIsFiltered = false
      Object.keys(filterSchluessel).forEach(key => {
        if (filterSchluessel[key]) {
          schluesselIsFiltered = true
          schluessel = schluessel.filter(p => {
            if (!filterSchluessel[key]) return true
            if (!p[key]) return false
            return p[key]
              .toString()
              .toLowerCase()
              .includes(filterSchluessel[key].toString().toLowerCase())
          })
        }
      })
      let mobileAbos = self.mobileAbos.filter(p => {
        if (!self.showDeleted) return p.deleted === 0
        return true
      })
      let mobileAbosIsFiltered = false
      Object.keys(filterMobileAbo).forEach(key => {
        if (filterMobileAbo[key]) {
          mobileAbosIsFiltered = true
          mobileAbos = mobileAbos.filter(p => {
            if (!filterMobileAbo[key]) return true
            if (!p[key]) return false
            return p[key]
              .toString()
              .toLowerCase()
              .includes(filterMobileAbo[key].toString().toLowerCase())
          })
        }
      })
      let kaderFunktionen = self.kaderFunktionen.filter(p => {
        if (!self.showDeleted) return p.deleted === 0
        return true
      })
      let kaderFunktionenIsFiltered = false
      Object.keys(filterKaderFunktion).forEach(key => {
        if (filterKaderFunktion[key]) {
          kaderFunktionenIsFiltered = true
          kaderFunktionen = kaderFunktionen.filter(p => {
            if (!filterKaderFunktion[key]) return true
            if (!p[key]) return false
            return p[key]
              .toString()
              .toLowerCase()
              .includes(filterKaderFunktion[key].toString().toLowerCase())
          })
        }
      })
      let etiketten = self.etiketten.filter(p => {
        if (!self.showDeleted) return p.deleted === 0
        return true
      })
      let etikettenIsFiltered = false
      Object.keys(filterEtikett).forEach(key => {
        if (filterEtikett[key]) {
          etikettenIsFiltered = true
          etiketten = etiketten.filter(p => {
            if (!filterEtikett[key]) return true
            if (!p[key]) return false
            return p[key]
              .toString()
              .toLowerCase()
              .includes(filterEtikett[key].toString().toLowerCase())
          })
        }
      })
      personen = personen
        .filter(p => {
          if (!self.showDeleted) return p.deleted === 0
          return true
        })
        .filter(p => {
          if (!schluesselIsFiltered) return true
          return schluessel.filter(s => s.idPerson === p.id).length > 0
        })
        .filter(p => {
          if (!mobileAbosIsFiltered) return true
          return mobileAbos.filter(s => s.idPerson === p.id).length > 0
        })
        .filter(p => {
          if (!kaderFunktionenIsFiltered) return true
          return kaderFunktionen.filter(s => s.idPerson === p.id).length > 0
        })
        .filter(p => {
          if (!etikettenIsFiltered) return true
          return etiketten.filter(s => s.idPerson === p.id).length > 0
        })
        .filter(p => {
          const { filterFulltext } = self
          if (!filterFulltext) return true
          // now check for any value if includes
          const personValues = Object.entries(p)
            .filter(e => e[0] !== 'id')
            .map(e => e[1])
          const schluesselValues = flatten(
            self.schluessel.filter(s => s.idPerson === p.id).map(s =>
              Object.entries(s)
                .filter(e => e[0] !== 'id')
                .map(e => e[1]),
            ),
          )
          const mobileAboValues = flatten(
            self.mobileAbos.filter(s => s.idPerson === p.id).map(s =>
              Object.entries(s)
                .filter(e => e[0] !== 'id')
                .map(e => e[1]),
            ),
          )
          const kaderFunktionValues = flatten(
            self.kaderFunktionen.filter(s => s.idPerson === p.id).map(s =>
              Object.entries(s)
                .filter(e => e[0] !== 'id')
                .map(e => e[1]),
            ),
          )
          const etikettValues = flatten(
            self.etiketten.filter(s => s.idPerson === p.id).map(s =>
              Object.entries(s)
                .filter(e => e[0] !== 'id')
                .map(e => e[1]),
            ),
          )
          return (
            [
              ...personValues,
              schluesselValues,
              mobileAboValues,
              kaderFunktionValues,
              etikettValues,
            ].filter(v => {
              if (!v) return false
              if (!v.toString()) return false
              return v
                .toString()
                .toLowerCase()
                .includes(filterFulltext.toString().toLowerCase())
            }).length > 0
          )
        })
        .sort((a, b) => {
          if (!a.name && !a.vorname) return -1
          if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase())
            return -1
          if (
            a.name === b.name &&
            a.vorname &&
            b.vorname &&
            a.vorname.toLowerCase() < b.vorname.toLowerCase()
          )
            return -1
          return 1
        })
      return personen
    },
  }))
  // functions are not serializable
  // so need to define this as volatile
  .volatile(() => ({
    deletionCallback: null,
  }))
  .actions(self => {
    setUndoManager(self)

    return {
      setFilter({ model, value }) {
        self[model] = value
        if (self.filterFulltext) self.filterFulltext = null
      },
      setFilterFulltext(value) {
        if (value && !self.filterFulltext && self.location.length === 2) {
          self.location.pop()
        }
        self.filterFulltext = value
        if (value && self.existsFilter) self.emptyFilter()
        if (self.showFilter) self.showFilter = false
      },
      emptyFilter() {
        self.filterPerson = {}
        self.filterEtikett = {}
        self.filterLink = {}
        self.filterSchluessel = {}
        self.filterMobileAbo = {}
        self.filterKaderFunktion = {}
      },
      setShowFilter(value) {
        self.showFilter = value
        if (value && self.filterFulltext) self.filterFulltext = null
      },
      setUsername(name) {
        self.username = name
      },
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
        self.watchMutations = false
        self.personen = personen
        self.watchMutations = true
      },
      setMutations(mutations) {
        self.mutations = mutations
      },
      setEtiketten(etiketten) {
        self.watchMutations = false
        self.etiketten = etiketten
        self.watchMutations = true
      },
      setLinks(links) {
        self.watchMutations = false
        self.links = links
        self.watchMutations = true
      },
      setSchluessel(schluessel) {
        self.watchMutations = false
        self.schluessel = schluessel
        self.watchMutations = true
      },
      setMobileAbos(mobileAbos) {
        self.watchMutations = false
        self.mobileAbos = mobileAbos
        self.watchMutations = true
      },
      setKaderFunktionen(kaderFunktionen) {
        self.watchMutations = false
        self.kaderFunktionen = kaderFunktionen
        self.watchMutations = true
      },
      setWerte({ table, values }) {
        self.watchMutations = false
        self[table] = values
        self.watchMutations = true
      },
      setShowDeleted(show) {
        self.showDeleted = show
      },
      revertMutation(mutationId) {
        const { mutations } = self
        const mutation = mutations.find(m => m.id === mutationId)
        if (!mutation) throw new Error(`Keine Mutation mit id ${id} gefunden`)
        const { id, op, tableName, rowId, field, previousValue } = mutation
        switch (op) {
          case 'replace': {
            // 1. check if dataset still exists, warn and exit if not
            const dataset = self[tableName].find(d => d.id === rowId)
            if (!dataset) {
              throw new Error(
                `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht aktualisiert`,
              )
            }
            // 2. update value
            self.updateField({
              table: tableName,
              parentModel: tableName,
              field,
              value: previousValue,
              id: rowId,
            })
            break
          }
          case 'add': {
            // not in use
            // 1. check if dataset still exists, warn and exit if not
            const dataset = self[tableName].find(d => d.id === rowId)
            if (!dataset) {
              throw new Error(
                `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht gelöscht`,
              )
            }
            // 2. remove dataset
            // write to db
            try {
              app.db
                .prepare(`delete from ${tableName} where id = ${rowId}`)
                .run()
            } catch (error) {
              return console.log(error)
            }
            // write to store
            self[tableName].splice(
              findIndex(self[tableName], p => p.id === rowId),
              1,
            )
            break
          }
          case 'remove': {
            // not in use
            // 1. check if dataset exists, warn and exit if does
            const dataset = self[tableName].find(d => d.id === rowId)
            if (dataset) {
              throw new Error(
                `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert. Daher wird er nicht wiederhergestellt`,
              )
            }
            // 2. add dataset
            // write to db
            const previousObject = JSON.parse(previousValue)
            // need to remove keys with value null
            Object.keys(previousObject).forEach(
              key => previousObject[key] == null && delete previousObject[key],
            )
            const objectKeys = keys(previousObject).join()
            const objectValues = lValues(previousObject)
            const sql = `insert into ${tableName} (${objectKeys}) values (${objectValues
              .map(() => '?')
              .join()})`
            try {
              app.db.prepare(sql).run(...objectValues)
            } catch (error) {
              return console.log(error)
            }
            // write to store
            self[tableName].push(previousObject)
            break
          }
          default:
          // do nothing
        }
      },
      addPerson() {
        // 1. create new Person in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into personen (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)',
            )
            .run({ user: self.username, zeit: Date.now() })
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.personen.push({
          id: info.lastInsertRowid,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.setLocation(['Personen', info.lastInsertRowid.toString()])
      },
      addMutation({ tableName, patch, inversePatch }) {
        // watchMutations is false while data is loaded from server
        // as these additions should not be added to mutations
        if (!self.watchMutations) return
        // need to wait for undoManager to list deletion
        setTimeout(() => {
          let info
          const { username } = self
          const time = Date.now()
          const { op, path, value: valueIn } = patch
          const [index, field] = splitJsonPath(path)
          // do not document mutation documentation
          if (field && field.includes('letzteMutation')) return
          let previousValue = null
          const value =
            valueIn !== null && typeof valueIn === 'object'
              ? JSON.stringify(valueIn)
              : valueIn
          let rowId
          switch (op) {
            case 'add':
              rowId = valueIn.id
              break
            case 'remove': {
              /**
               * Problem:
               * - inversePatch is undefined
               * - patch has no value
               * - self[tableName][index] was already removed
               * so how get id or better value of removed dataset?
               * Solution: get this from undoManager's history
               * But: need to setTimeout to let undoManager catch up
               */
              const historyChanges = undoManager.history
              const historyInversePatches = flatten(
                historyChanges.map(c => c.inversePatches),
              )
              const historyInversePatch =
                findLast(
                  historyInversePatches,
                  p => p.op === 'add' && p.path === `/${tableName}/${index}`,
                ) || {}
              previousValue = JSON.stringify(historyInversePatch.value)
              rowId = historyInversePatch.value.id
              break
            }
            case 'replace': {
              const storeObject = self[tableName][index]
              rowId = storeObject.id
              previousValue = inversePatch.value
              break
            }
            default:
            // do nothing
          }
          try {
            info = app.db
              .prepare(
                'insert into mutations (time, user, op, tableName, rowId, field, value, previousValue) values (@time, @username, @op, @tableName, @rowId, @field, @value, @previousValue)',
              )
              .run({
                username,
                time,
                tableName,
                op,
                rowId,
                field,
                value,
                previousValue,
              })
          } catch (error) {
            return console.log(error)
          }
          // 2. add to store
          // need to call other action as this happens inside timeout
          self.mutate({
            id: info.lastInsertRowid,
            time,
            user: username,
            op,
            tableName,
            rowId,
            field,
            value,
            previousValue,
          })
        })
      },
      mutate(mutation) {
        self.mutations.push(mutation)
      },
      addWert(table) {
        // 1. create new value in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              `insert into ${table} (letzteMutationUser,letzteMutationZeit) values (@letzteMutationUser,@letzteMutationZeit)`,
            )
            .run({
              letzteMutationUser: self.username,
              letzteMutationZeit: Date.now(),
            })
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self[table].push({
          id: info.lastInsertRowid,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.setLocation([table, info.lastInsertRowid.toString()])
      },
      setWertDeleted({ id, table }) {
        // write to db
        try {
          app.db
            .prepare(`update ${table} set deleted = 1 where id = ?;`)
            .run(id)
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
        self[table].splice(findIndex(self[table], p => p.id === id), 1)
        self.setLocation([table])
      },
      setPersonDeleted(id) {
        // write to db
        try {
          app.db
            .prepare(
              `update personen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            )
            .run({ id, user: self.username, time: Date.now() })
        } catch (error) {
          return console.log(error)
        }
        // write to store
        const person = self.personen.find(p => p.id === id)
        person.deleted = 1
        person.letzteMutationUser = self.username
        person.letzteMutationZeit = Date.now()
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
        /**
         * Do not use filter! Reason:
         * rebuilds self.personen. Consequence:
         * all other personen are re-added and listet as mutations of op 'add'
         */
        self.personen.splice(findIndex(self.personen, p => p.id === id), 1)
        self.setLocation(['Personen'])
      },
      addEtikett(etikett) {
        // grab idPerson from location
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new etikett in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into etiketten (idPerson, etikett, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
            )
            .run(idPerson, etikett, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.etiketten.push({
          id: info.lastInsertRowid,
          etikett,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.updatePersonsMutation(idPerson)
      },
      deleteEtikett(etikett) {
        // grab idPerson from location
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        // write to db
        try {
          app.db
            .prepare('delete from etiketten where idPerson = ? and etikett = ?')
            .run(idPerson, etikett)
        } catch (error) {
          return console.log(error)
        }
        // write to store
        self.etiketten.splice(
          findIndex(
            self.etiketten,
            e => e.idPerson === idPerson && e.etikett === etikett,
          ),
          1,
        )
        self.updatePersonsMutation(idPerson)
      },
      addLink(url) {
        // grab idPerson from location
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into links (idPerson, url, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
            )
            .run(idPerson, url, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.links.push({
          id: info.lastInsertRowid,
          url,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.updatePersonsMutation(idPerson)
      },
      deleteLink(id) {
        // write to db
        try {
          app.db.prepare('delete from links where id = ?').run(id)
        } catch (error) {
          return console.log(error)
        }
        // write to store
        self.links.splice(findIndex(self.links, p => p.id === id), 1)
        // set persons letzteMutation
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      addSchluessel() {
        // grab idPerson from location
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into schluessel (idPerson, letzteMutationUser, letzteMutationZeit) values (?,?,?)',
            )
            .run(idPerson, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.schluessel.push({
          id: info.lastInsertRowid,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.updatePersonsMutation(idPerson)
      },
      deleteSchluessel(id) {
        // write to db
        try {
          app.db.prepare('delete from schluessel where id = ?').run(id)
        } catch (error) {
          return console.log(error)
        }
        // write to store
        self.schluessel.splice(findIndex(self.schluessel, p => p.id === id), 1)
        // set persons letzteMutation
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      addMobileAbo() {
        // grab idPerson from location
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into mobileAbos (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)',
            )
            .run(idPerson, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.mobileAbos.push({
          id: info.lastInsertRowid,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.updatePersonsMutation(idPerson)
      },
      deleteMobileAbo(id) {
        // write to db
        try {
          app.db.prepare('delete from mobileAbos where id = ?').run(id)
        } catch (error) {
          return console.log(error)
        }
        // write to store
        self.mobileAbos.splice(findIndex(self.mobileAbos, p => p.id === id), 1)
        // set persons letzteMutation
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      addKaderFunktion() {
        // grab idPerson from location
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into kaderFunktionen (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)',
            )
            .run(idPerson, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.kaderFunktionen.push({
          id: info.lastInsertRowid,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now(),
        })
        self.updatePersonsMutation(idPerson)
      },
      deleteKaderFunktion(id) {
        // write to db
        try {
          app.db.prepare('delete from kaderFunktionen where id = ?').run(id)
        } catch (error) {
          return console.log(error)
        }
        // write to store
        self.kaderFunktionen.splice(
          findIndex(self.kaderFunktionen, p => p.id === id),
          1,
        )
        // set persons letzteMutation
        const {location} = self
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      updateField({ table, parentModel, field, value, id }) {
        try {
          app.db
            .prepare(
              `update ${table} set ${field} = @value, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            )
            .run({
              value,
              id,
              user: self.username,
              time: Date.now(),
            })
        } catch (error) {
          return console.log(error)
        }
        const storeObject = self[parentModel].find(o => o.id === id)
        if (!storeObject) {
          return console.log(
            `Error: no ${table} with id "${id}" found in store`,
          )
        }
        storeObject[field] = value
        storeObject.letzteMutationUser = self.username
        storeObject.letzteMutationZeit = Date.now()
        if (
          [
            'links',
            'schluessel',
            'mobileAbos',
            'kaderFunktionen',
            'etiketten',
          ].includes(parentModel)
        ) {
          // set persons letzteMutation
          const {location} = self
          const idPerson = ifIsNumericAsNumber(location[1])
          self.updatePersonsMutation(idPerson)
        }
      },
      updatePersonsMutation(idPerson) {
        // in db
        try {
          app.db
            .prepare(
              `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            )
            .run({
              user: self.username,
              time: Date.now(),
              id: idPerson,
            })
        } catch (error) {
          return console.log(error)
        }
        // in store
        const person = self.personen.find(p => p.id === idPerson)
        person.letzteMutationUser = self.username
        person.letzteMutationZeit = Date.now()
      },
    }
  })

// eslint-disable-next-line import/no-mutable-exports
export let undoManager = {}
export const setUndoManager = targetStore => {
  undoManager = targetStore.history
}
export default myTypes
