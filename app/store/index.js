import { types, splitJsonPath } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import app from 'ampersand-app'
import findIndex from 'lodash/findIndex'
import flatten from 'lodash/flatten'
import findLast from 'lodash/findLast'

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
    history: types.optional(UndoManager, {})
  })
  // functions are not serializable
  // so need to define this as volatile
  .volatile(() => ({
    deletionCallback: null
  }))
  .actions(self => {
    setUndoManager(self)

    return {
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
                `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr`
              )
            }
            // 2. update value
            self.updateField({
              table: tableName,
              parentModel: tableName,
              field,
              value: previousValue,
              id: rowId
            })
            break
          }
          case 'add': {
            // not in use
            // 1. check if dataset still exists, warn and exit if not
            const dataset = self[tableName].find(d => d.id === rowId)
            if (!dataset) {
              throw new Error(
                `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht gelöscht`
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
            self[tableName] = self[tableName].filter(p => p.id !== rowId)
            break
          }
          case 'remove': {
            // not in use
            // 1. check if dataset still exists, warn and exit if not
            const dataset = self[tableName].find(d => d.id === rowId)
            if (!dataset) {
              throw new Error(
                `Der Datensatz aus Tabelle ${tableName} mit id ${rowId} existiert nicht mehr. Daher wird er nicht gelöscht`
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
            self[tableName] = self[tableName].filter(p => p.id !== rowId)
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
              'insert into personen (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)'
            )
            .run({ user: self.username, zeit: Date.now() })
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.personen.push({
          id: info.lastInsertROWID,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now()
        })
        self.setLocation(['Personen', info.lastInsertROWID.toString()])
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
               * Is it maybe possible to get this from undoManager's history?
               */

              const historyChanges = undoManager.history.toJSON()
              const historyInversePatches = flatten(
                historyChanges.map(c => c.inversePatches)
              )
              const historyInversePatch =
                findLast(
                  historyInversePatches,
                  p => p.op === 'add' && p.path === `/${tableName}/${index}`
                ) || {}
              console.log('Store, addMutation?:', {
                tableName,
                patch,
                inversePatch,
                historyInversePatch,
                previousValue: historyInversePatch.value
              })
              previousValue = JSON.stringify(historyInversePatch.value)
              rowId = historyInversePatch.value.id
              break
            }
            case 'replace': {
              const storeObject = self[tableName][index]
              rowId = storeObject.id
              previousValue = inversePatch.value
              console.log('Store, addMutation?:', {
                tableName,
                patch,
                inversePatch
              })
              break
            }
            default:
            // do nothing
          }
          console.log('Store, addMutation:', {
            previousValue
          })
          try {
            info = app.db
              .prepare(
                'insert into mutations (time, user, op, tableName, rowId, field, value, previousValue) values (@time, @username, @op, @tableName, @rowId, @field, @value, @previousValue)'
              )
              .run({
                username,
                time,
                tableName,
                op,
                rowId,
                field,
                value,
                previousValue
              })
          } catch (error) {
            return console.log(error)
          }
          // 2. add to store
          // need to call other action as this happens inside timeout
          self.mutate({
            id: info.lastInsertROWID,
            time,
            user: username,
            op,
            tableName,
            rowId,
            field,
            value,
            previousValue
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
        self[table] = self[table].filter(p => p.id !== id)
        self.setLocation([table])
      },
      setPersonDeleted(id) {
        // write to db
        try {
          app.db
            .prepare(
              `update personen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`
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
        console.log('Store, deletePerson with id:', id)
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
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new etikett in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into etiketten (idPerson, etikett, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)'
            )
            .run(idPerson, etikett, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.etiketten.push({
          id: info.lastInsertROWID,
          etikett,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now()
        })
        self.updatePersonsMutation(idPerson)
      },
      deleteEtikett(etikett) {
        // grab idPerson from location
        const location = self.location.toJSON()
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
        /* self.etiketten.splice(
        findIndex(
          self.etiketten,
          e => e.idPerson === idPerson && e.etikett === etikett
        ),
        1
      ) */
        self.etiketten = self.etiketten.filter(
          e => !(e.idPerson === idPerson && e.etikett === etikett)
        )
        self.updatePersonsMutation(idPerson)
      },
      addLink(url) {
        // grab idPerson from location
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into links (idPerson, url, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)'
            )
            .run(idPerson, url, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.links.push({
          id: info.lastInsertROWID,
          url,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now()
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
        self.links = self.links.filter(e => !(e.id === id))
        // set persons letzteMutation
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      addSchluessel() {
        // grab idPerson from location
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into schluessel (idPerson, letzteMutationUser, letzteMutationZeit) values (?,?,?)'
            )
            .run(idPerson, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.schluessel.push({
          id: info.lastInsertROWID,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now()
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
        self.schluessel = self.schluessel.filter(e => !(e.id === id))
        // set persons letzteMutation
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      addMobileAbo() {
        // grab idPerson from location
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into mobileAbos (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)'
            )
            .run(idPerson, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.mobileAbos.push({
          id: info.lastInsertROWID,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now()
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
        self.mobileAbos = self.mobileAbos.filter(e => !(e.id === id))
        // set persons letzteMutation
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      addKaderFunktion() {
        // grab idPerson from location
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        // 1. create new link in db, returning id
        let info
        try {
          info = app.db
            .prepare(
              'insert into kaderFunktionen (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)'
            )
            .run(idPerson, self.username, Date.now())
        } catch (error) {
          return console.log(error)
        }
        // 2. add to store
        self.kaderFunktionen.push({
          id: info.lastInsertROWID,
          idPerson,
          letzteMutationUser: self.username,
          letzteMutationZeit: Date.now()
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
        self.kaderFunktionen = self.kaderFunktionen.filter(e => !(e.id === id))
        // set persons letzteMutation
        const location = self.location.toJSON()
        const idPerson = ifIsNumericAsNumber(location[1])
        self.updatePersonsMutation(idPerson)
      },
      updateField({ table, parentModel, field, value, id }) {
        console.log('Store, updateField:', {
          table,
          parentModel,
          field,
          value,
          id
        })
        try {
          app.db
            .prepare(
              `update ${table} set ${field} = @value, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`
            )
            .run({
              value,
              id,
              user: self.username,
              time: Date.now()
            })
        } catch (error) {
          return console.log(error)
        }
        const storeObject = self[parentModel].find(o => o.id === id)
        if (!storeObject) {
          return console.log(
            `Error: no ${table} with id "${id}" found in store`
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
            'etiketten'
          ].includes(parentModel)
        ) {
          // set persons letzteMutation
          const location = self.location.toJSON()
          const idPerson = ifIsNumericAsNumber(location[1])
          self.updatePersonsMutation(idPerson)
        }
      },
      updatePersonsMutation(idPerson) {
        // in db
        try {
          app.db
            .prepare(
              `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`
            )
            .run({
              user: self.username,
              time: Date.now(),
              id: idPerson
            })
        } catch (error) {
          return console.log(error)
        }
        // in store
        const person = self.personen.find(p => p.id === idPerson)
        person.letzteMutationUser = self.username
        person.letzteMutationZeit = Date.now()
      }
    }
  })

// eslint-disable-next-line import/no-mutable-exports
export let undoManager = {}
export const setUndoManager = targetStore => {
  undoManager = targetStore.history
}
export default myTypes
