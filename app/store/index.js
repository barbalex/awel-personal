import { types, splitJsonPath, getSnapshot } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import findIndex from 'lodash/findIndex'
import flatten from 'lodash/flatten'
import findLast from 'lodash/findLast'
import uniqBy from 'lodash/uniqBy'
import keys from 'lodash/keys'
import lValues from 'lodash/values'

import Amt from './Amt'
import Abteilung from './Abteilung'
import Settings from './Settings'
import Bereich from './Bereich'
import Sektion from './Sektion'
import Etikett from './Etikett'
import AnredeWert from './AnredeWert'
import FunktionWert from './FunktionWert'
import KostenstelleWert from './KostenstelleWert'
import Link from './Link'
import Schluessel from './Schluessel'
import MobileAbo from './MobileAbo'
import Telefon from './Telefon'
import Funktion from './Funktion'
import MobileAboKostenstelleWert from './MobileAboKostenstelleWert'
import MobileAboTypWert from './MobileAboTypWert'
import TelefonTypWert from './TelefonTypWert'
import SchluesselTypWert from './SchluesselTypWert'
import SchluesselAnlageWert from './SchluesselAnlageWert'
import EtikettWert from './EtikettWert'
import LandWert from './LandWert'
import Person from './Person'
import Mutation from './Mutation'
import StatusWert from './StatusWert'
import TagWert from './TagWert'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

export default db =>
  types
    .model({
      deletionMessage: types.maybeNull(types.string),
      deletionTitle: types.maybeNull(types.string),
      etiketten: types.array(Etikett),
      anredeWerte: types.array(AnredeWert),
      funktionWerte: types.array(FunktionWert),
      kostenstelleWerte: types.array(KostenstelleWert),
      links: types.array(Link),
      schluessel: types.array(Schluessel),
      mobileAbos: types.array(MobileAbo),
      telefones: types.array(Telefon),
      funktionen: types.array(Funktion),
      mobileAboKostenstelleWerte: types.array(MobileAboKostenstelleWert),
      mobileAboTypWerte: types.array(MobileAboTypWert),
      telefonTypWerte: types.array(TelefonTypWert),
      schluesselTypWerte: types.array(SchluesselTypWert),
      schluesselAnlageWerte: types.array(SchluesselAnlageWert),
      etikettWerte: types.array(EtikettWert),
      landWerte: types.array(LandWert),
      personen: types.array(Person),
      aemter: types.array(Amt),
      abteilungen: types.array(Abteilung),
      settings: types.optional(Settings, { id: 1, schluesselFormPath: null }),
      bereiche: types.array(Bereich),
      sektionen: types.array(Sektion),
      mutations: types.array(Mutation),
      location: types.optional(types.array(types.string), ['Personen']),
      showDeleted: types.optional(types.boolean, false),
      showMutationNoetig: types.optional(types.boolean, false),
      statusWerte: types.array(StatusWert),
      tagWerte: types.array(TagWert),
      username: types.maybe(types.string),
      watchMutations: types.optional(types.boolean, false),
      history: types.optional(UndoManager, {}),
      filterPerson: types.optional(Person, {}),
      filterAmt: types.optional(Amt, {}),
      filterAbteilung: types.optional(Abteilung, {}),
      filterBereich: types.optional(Bereich, {}),
      filterSektion: types.optional(Sektion, {}),
      filterEtikett: types.optional(Etikett, {}),
      filterLink: types.optional(Link, {}),
      filterSchluessel: types.optional(Schluessel, {}),
      filterMobileAbo: types.optional(MobileAbo, {}),
      filterTelefon: types.optional(Telefon, {}),
      filterFunktion: types.optional(Funktion, {}),
      showFilter: types.optional(types.boolean, false),
      filterFulltext: types.maybe(
        types.union(types.string, types.integer, types.null),
      ),
    })
    .views(self => ({
      get existsFilter() {
        const {
          filterPerson,
          filterAmt,
          filterAbteilung,
          filterBereich,
          filterSektion,
          filterEtikett,
          filterLink,
          filterSchluessel,
          filterMobileAbo,
          filterTelefon,
          filterFunktion,
        } = self
        return (
          [
            ...Object.values(filterPerson),
            ...Object.values(filterAmt),
            ...Object.values(filterAbteilung),
            ...Object.values(filterBereich),
            ...Object.values(filterSektion),
            ...Object.values(filterEtikett),
            ...Object.values(filterLink),
            ...Object.values(filterSchluessel),
            ...Object.values(filterMobileAbo),
            ...Object.values(filterTelefon),
            ...Object.values(filterFunktion),
          ].filter(v => v).length > 0
        )
      },
      get personenFiltered() {
        const {
          filterSchluessel,
          filterMobileAbo,
          filterTelefon,
          filterFunktion,
          filterEtikett,
          filterPerson,
        } = self
        let { personen } = self
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
        let telefones = self.telefones.filter(p => {
          if (!self.showDeleted) return p.deleted === 0
          return true
        })
        let telefonesIsFiltered = false
        Object.keys(filterTelefon).forEach(key => {
          if (filterTelefon[key]) {
            telefonesIsFiltered = true
            telefones = telefones.filter(p => {
              if (!filterTelefon[key]) return true
              if (!p[key]) return false
              return p[key]
                .toString()
                .toLowerCase()
                .includes(filterTelefon[key].toString().toLowerCase())
            })
          }
        })
        let funktionen = self.funktionen.filter(p => {
          if (!self.showDeleted) return p.deleted === 0
          return true
        })
        let funktionenIsFiltered = false
        Object.keys(filterFunktion).forEach(key => {
          if (filterFunktion[key]) {
            funktionenIsFiltered = true
            funktionen = funktionen.filter(p => {
              if (!filterFunktion[key]) return true
              if (!p[key]) return false
              return p[key]
                .toString()
                .toLowerCase()
                .includes(filterFunktion[key].toString().toLowerCase())
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
            if (!telefonesIsFiltered) return true
            return telefones.filter(s => s.idPerson === p.id).length > 0
          })
          .filter(p => {
            if (!funktionenIsFiltered) return true
            return funktionen.filter(s => s.idPerson === p.id).length > 0
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
              self.schluessel
                .filter(s => s.idPerson === p.id)
                .map(s =>
                  Object.entries(s)
                    .filter(e => e[0] !== 'id')
                    .map(e => e[1]),
                ),
            )
            const mobileAboValues = flatten(
              self.mobileAbos
                .filter(s => s.idPerson === p.id)
                .map(s =>
                  Object.entries(s)
                    .filter(e => e[0] !== 'id')
                    .map(e => e[1]),
                ),
            )
            const telefonValues = flatten(
              self.telefones
                .filter(s => s.idPerson === p.id)
                .map(s =>
                  Object.entries(s)
                    .filter(e => e[0] !== 'id')
                    .map(e => e[1]),
                ),
            )
            const funktionValues = flatten(
              self.funktionen
                .filter(s => s.idPerson === p.id)
                .map(s =>
                  Object.entries(s)
                    .filter(e => e[0] !== 'id')
                    .map(e => e[1]),
                ),
            )
            const etikettValues = flatten(
              self.etiketten
                .filter(s => s.idPerson === p.id)
                .map(s =>
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
                telefonValues,
                funktionValues,
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
      get aemterFiltered() {
        const { filterAmt, filterFulltext } = self
        let aemter = getSnapshot(self.aemter)
        Object.keys(filterAmt).forEach(key => {
          if (filterAmt[key] || filterAmt[key] === 0) {
            aemter = aemter.filter(p => {
              if (!filterAmt[key]) return true
              if (!p[key]) return false
              return p[key]
                .toString()
                .toLowerCase()
                .includes(filterAmt[key].toString().toLowerCase())
            })
          }
        })
        aemter = aemter
          .filter(p => {
            if (!self.showDeleted) return p.deleted === 0
            return true
          })
          .filter(p => {
            if (!filterFulltext) return true
            // now check for any value if includes
            const amtValues = Object.entries(p)
              .filter(e => e[0] !== 'id')
              .map(e => e[1])
            return (
              [...amtValues].filter(v => {
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
            if (!a.name && b.name) return -1
            if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase())
              return -1
            return 1
          })
        return aemter
      },
      get abteilungenFiltered() {
        const { filterAbteilung, filterFulltext } = self
        let abteilungen = getSnapshot(self.abteilungen)
        Object.keys(filterAbteilung).forEach(key => {
          if (filterAbteilung[key] || filterAbteilung[key] === 0) {
            abteilungen = abteilungen.filter(p => {
              if (!filterAbteilung[key]) return true
              if (!p[key]) return false
              return p[key]
                .toString()
                .toLowerCase()
                .includes(filterAbteilung[key].toString().toLowerCase())
            })
          }
        })
        abteilungen = abteilungen
          .filter(p => {
            if (!self.showDeleted) return p.deleted === 0
            return true
          })
          .filter(p => {
            if (!filterFulltext) return true
            // now check for any value if includes
            const abteilungValues = Object.entries(p)
              .filter(e => e[0] !== 'id')
              .map(e => e[1])
            return (
              [...abteilungValues].filter(v => {
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
            if (!a.name && b.name) return -1
            if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase())
              return -1
            return 1
          })
        return abteilungen
      },
      get bereicheFiltered() {
        const { filterFulltext } = self
        let bereiche = getSnapshot(self.bereiche)
        const filterBereich = getSnapshot(self.filterBereich)
        Object.keys(filterBereich).forEach(key => {
          if (filterBereich[key] || filterBereich[key] === 0) {
            bereiche = bereiche.filter(p => {
              if (!filterBereich[key]) return true
              if (!p[key]) return false
              return p[key]
                .toString()
                .toLowerCase()
                .includes(filterBereich[key].toString().toLowerCase())
            })
          }
        })
        bereiche = bereiche
          .filter(p => {
            if (!self.showDeleted) return p.deleted === 0
            return true
          })
          .filter(p => {
            if (!filterFulltext) return true
            // now check for any value if includes
            const personValues = Object.entries(p)
              .filter(e => e[0] !== 'id')
              .map(e => e[1])
            return (
              [...personValues].filter(v => {
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
            if (!a.name && b.name) return -1
            if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase())
              return -1
            return 1
          })
        return bereiche
      },
      get sektionenFiltered() {
        const { filterFulltext } = self
        let sektionen = getSnapshot(self.sektionen)
        const filterSektion = getSnapshot(self.filterSektion)
        Object.keys(filterSektion).forEach(key => {
          if (filterSektion[key] || filterSektion[key] === 0) {
            sektionen = sektionen.filter(p => {
              if (!filterSektion[key]) return true
              if (!p[key]) return false
              return p[key]
                .toString()
                .toLowerCase()
                .includes(filterSektion[key].toString().toLowerCase())
            })
          }
        })
        sektionen = sektionen
          .filter(p => {
            if (!self.showDeleted) return p.deleted === 0
            return true
          })
          .filter(p => {
            if (!filterFulltext) return true
            // now check for any value if includes
            const personValues = Object.entries(p)
              .filter(e => e[0] !== 'id')
              .map(e => e[1])
            return (
              [...personValues].filter(v => {
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
            if (!a.name && b.name) return -1
            if (a.name && b.name && a.name.toLowerCase() < b.name.toLowerCase())
              return -1
            return 1
          })
        return sektionen
      },
    }))
    // functions are not serializable
    // so need to define this as volatile
    .volatile(() => ({
      deletionCallback: null,
      errors: [],
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
          self.filterAbteilung = {}
          self.filterBereich = {}
          self.filterSektion = {}
          self.filterEtikett = {}
          self.filterLink = {}
          self.filterSchluessel = {}
          self.filterKostenstelle = {}
          self.filterMobileAbo = {}
          self.filterTelefon = {}
          self.filterFunktion = {}
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
        setAemter(aemter) {
          self.watchMutations = false
          self.aemter = aemter
          self.watchMutations = true
        },
        setAbteilungen(abteilungen) {
          self.watchMutations = false
          self.abteilungen = abteilungen
          self.watchMutations = true
        },
        setBereiche(bereiche) {
          self.watchMutations = false
          self.bereiche = bereiche
          self.watchMutations = true
        },
        setSektionen(sektionen) {
          self.watchMutations = false
          self.sektionen = sektionen
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
        setKostenstelle(kostenstelle) {
          self.watchMutations = false
          self.kostenstelle = kostenstelle
          self.watchMutations = true
        },
        setMobileAbos(mobileAbos) {
          self.watchMutations = false
          self.mobileAbos = mobileAbos
          self.watchMutations = true
        },
        setTelefones(telefones) {
          self.watchMutations = false
          self.telefones = telefones
          self.watchMutations = true
        },
        setFunktionen(funktionen) {
          self.watchMutations = false
          self.funktionen = funktionen
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
        setShowMutationNoetig(show) {
          self.showMutationNoetig = show
        },
        revertMutation(mutationId) {
          const { mutations } = self
          const mutation = mutations.find(m => m.id === mutationId)
          if (!mutation) {
            throw new Error(`Keine Mutation mit id ${mutationId} gefunden`)
          }
          const { op, tableName, rowId, field, previousValue } = mutation
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
                // sqlite stores numbers in text fields by adding .0
                // need to convert to number or it will fail
                value: ifIsNumericAsNumber(previousValue),
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
                db.prepare(`delete from ${tableName} where id = ${rowId}`).run()
              } catch (error) {
                self.addError(error)
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
                key =>
                  previousObject[key] == null && delete previousObject[key],
              )
              console.log('store, revertMutation', {
                mutationId,
                previousObject,
              })
              const objectKeys = keys(previousObject).join()
              const objectValues = lValues(previousObject)
              const sql = `insert into ${tableName} (${objectKeys}) values (${objectValues
                .map(() => '?')
                .join()})`
              try {
                db.prepare(sql).run(...objectValues)
              } catch (error) {
                self.addError(error)
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
            info = db
              .prepare(
                'insert into personen (letzteMutationUser, letzteMutationZeit, land) values (@user, @zeit, @land)',
              )
              .run({ user: self.username, zeit: Date.now(), land: 'Schweiz' })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.personen.push({
            id: info.lastInsertRowid,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
            land: 'Schweiz',
          })
          self.setLocation(['Personen', info.lastInsertRowid.toString()])
        },
        addAmt() {
          // 1. create new Amt in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into aemter (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)',
              )
              .run({ user: self.username, zeit: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.aemter.push({
            id: info.lastInsertRowid,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.setLocation(['Aemter', info.lastInsertRowid.toString()])
        },
        addAbteilung() {
          // 1. create new Abteilung in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into abteilungen (letzteMutationUser, letzteMutationZeit, amt) values (@user, @zeit, @amt)',
              )
              .run({ user: self.username, zeit: Date.now(), amt: 1 })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.abteilungen.push({
            id: info.lastInsertRowid,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.setLocation(['Abteilungen', info.lastInsertRowid.toString()])
        },
        addBereich() {
          // 1. create new Bereich in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into bereiche (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)',
              )
              .run({ user: self.username, zeit: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.bereiche.push({
            id: info.lastInsertRowid,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.setLocation(['Bereiche', info.lastInsertRowid.toString()])
        },
        addSektion() {
          // 1. create new Sektion in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into sektionen (letzteMutationUser, letzteMutationZeit) values (@user, @zeit)',
              )
              .run({ user: self.username, zeit: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.sektionen.push({
            id: info.lastInsertRowid,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.setLocation(['Sektionen', info.lastInsertRowid.toString()])
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
              info = db
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
              self.addError(error)
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
            info = db
              .prepare(
                `insert into ${table} (letzteMutationUser,letzteMutationZeit) values (@letzteMutationUser,@letzteMutationZeit)`,
              )
              .run({
                letzteMutationUser: self.username,
                letzteMutationZeit: Date.now(),
              })
          } catch (error) {
            self.addError(error)
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
            db.prepare(`update ${table} set deleted = 1 where id = ?;`).run(id)
          } catch (error) {
            self.addError(error)
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
            db.prepare(`delete from ${table} where id = ${id}`).run()
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self[table].splice(findIndex(self[table], p => p.id === id), 1)
          self.setLocation([table])
        },
        setPersonDeleted(id) {
          // write to db
          try {
            db.prepare(
              `update personen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
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
            db.prepare('delete from personen where id = ?').run(id)
          } catch (error) {
            self.addError(error)
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
        setAmtDeleted(id) {
          // write to db
          try {
            db.prepare(
              `update aemter set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const amt = self.aemter.find(p => p.id === id)
          amt.deleted = 1
          amt.letzteMutationUser = self.username
          amt.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.setLocation(['Aemter'])
        },
        setAbteilungDeleted(id) {
          // write to db
          try {
            db.prepare(
              `update abteilungen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const abteilung = self.abteilungen.find(p => p.id === id)
          abteilung.deleted = 1
          abteilung.letzteMutationUser = self.username
          abteilung.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.setLocation(['Abteilungen'])
        },
        deleteAmt(id) {
          // write to db
          try {
            db.prepare('delete from aemter where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.aemter. Consequence:
           * all other aemter are re-added and listet as mutations of op 'add'
           */
          self.aemter.splice(findIndex(self.aemter, p => p.id === id), 1)
          self.setLocation(['Aemter'])
        },
        deleteAbteilung(id) {
          // write to db
          try {
            db.prepare('delete from abteilungen where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.abteilungen. Consequence:
           * all other abteilungen are re-added and listet as mutations of op 'add'
           */
          self.abteilungen.splice(
            findIndex(self.abteilungen, p => p.id === id),
            1,
          )
          self.setLocation(['Abteilungen'])
        },
        setBereichDeleted(id) {
          // write to db
          try {
            db.prepare(
              `update bereiche set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const bereich = self.bereiche.find(p => p.id === id)
          bereich.deleted = 1
          bereich.letzteMutationUser = self.username
          bereich.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.setLocation(['Bereichen'])
        },
        deleteBereich(id) {
          // write to db
          try {
            db.prepare('delete from bereiche where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.bereiche. Consequence:
           * all other bereiche are re-added and listet as mutations of op 'add'
           */
          self.bereiche.splice(findIndex(self.bereiche, p => p.id === id), 1)
          self.setLocation(['Bereichen'])
        },
        setSektionDeleted(id) {
          // write to db
          try {
            db.prepare(
              `update sektionen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const sektion = self.sektionen.find(p => p.id === id)
          sektion.deleted = 1
          sektion.letzteMutationUser = self.username
          sektion.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.setLocation(['Sektionen'])
        },
        deleteSektion(id) {
          // write to db
          try {
            db.prepare('delete from sektionen where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          /**
           * Do not use filter! Reason:
           * rebuilds self.sektionen. Consequence:
           * all other sektionen are re-added and listet as mutations of op 'add'
           */
          self.sektionen.splice(findIndex(self.sektionen, p => p.id === id), 1)
          self.setLocation(['Sektionen'])
        },
        addEtikett(etikett) {
          // grab idPerson from location
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // 1. create new etikett in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into etiketten (idPerson, etikett, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(idPerson, etikett, self.username, Date.now())
          } catch (error) {
            self.addError(error)
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
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // write to db
          try {
            db.prepare(
              'delete from etiketten where idPerson = ? and etikett = ?',
            ).run(idPerson, etikett)
          } catch (error) {
            self.addError(error)
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
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // 1. create new link in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into links (idPerson, url, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(idPerson, url, self.username, Date.now())
          } catch (error) {
            self.addError(error)
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
            db.prepare('delete from links where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.links.splice(findIndex(self.links, p => p.id === id), 1)
          // set persons letzteMutation
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          self.updatePersonsMutation(idPerson)
        },
        addSchluessel() {
          // grab idPerson from location
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // 1. create new link in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into schluessel (idPerson, letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(idPerson, self.username, Date.now())
          } catch (error) {
            self.addError(error)
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
            db.prepare('delete from schluessel where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.schluessel.splice(
            findIndex(self.schluessel, p => p.id === id),
            1,
          )
          // set persons letzteMutation
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          self.updatePersonsMutation(idPerson)
        },
        addKostenstelle() {
          // grab idSektion from location
          const { location } = self
          const idSektion = ifIsNumericAsNumber(location[1])
          // 1. create new link in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into kostenstelle (idSektion, letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(idSektion, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.kostenstelle.push({
            id: info.lastInsertRowid,
            idSektion,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updateSektionsMutation(idSektion)
        },
        deleteKostenstelle(id) {
          // write to db
          try {
            db.prepare('delete from kostenstelle where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.kostenstelle.splice(
            findIndex(self.kostenstelle, p => p.id === id),
            1,
          )
          // set persons letzteMutation
          const { location } = self
          const idSektion = ifIsNumericAsNumber(location[1])
          self.updateSektionsMutation(idSektion)
        },
        addMobileAbo() {
          // grab idPerson from location
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // 1. create new link in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into mobileAbos (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(idPerson, self.username, Date.now())
          } catch (error) {
            self.addError(error)
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
        addTelefon() {
          // grab idPerson from location
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // 1. create new link in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into telefones (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(idPerson, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.telefones.push({
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
            db.prepare('delete from mobileAbos where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.mobileAbos.splice(
            findIndex(self.mobileAbos, p => p.id === id),
            1,
          )
          // set persons letzteMutation
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          self.updatePersonsMutation(idPerson)
        },
        deleteTelefon(id) {
          // write to db
          try {
            db.prepare('delete from telefones where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.telefones.splice(findIndex(self.telefones, p => p.id === id), 1)
          // set persons letzteMutation
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          self.updatePersonsMutation(idPerson)
        },
        addFunktion(funktion) {
          // grab idPerson from location
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // 1. create new funktion in db, returning id
          let info
          try {
            info = db
              .prepare(
                'insert into funktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(idPerson, funktion, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.funktionen.push({
            id: info.lastInsertRowid,
            funktion,
            idPerson,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(idPerson)
        },
        deleteFunktion(funktion) {
          // grab idPerson from location
          const { location } = self
          const idPerson = ifIsNumericAsNumber(location[1])
          // write to db
          try {
            db.prepare(
              'delete from funktionen where idPerson = ? and funktion = ?',
            ).run(idPerson, funktion)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.funktionen.splice(
            findIndex(
              self.funktionen,
              e => e.idPerson === idPerson && e.funktion === funktion,
            ),
            1,
          )
          self.updatePersonsMutation(idPerson)
        },
        updateField({ table, parentModel, field, value, id, setErrors }) {
          // 1. update in db
          try {
            db.prepare(
              `update ${table} set ${field} = @value, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({
              value,
              id,
              user: self.username,
              time: Date.now(),
            })
          } catch (error) {
            self.addError(error)
            return setErrors({
              [field]: error.message,
            })
          }
          // 2. update in store
          const storeObject = self[parentModel].find(o => o.id === id)
          if (!storeObject) {
            return setErrors({
              [field]: `Error: no ${table} with id "${id}" found in store`,
            })
          }
          storeObject[field] = value
          storeObject.letzteMutationUser = self.username
          storeObject.letzteMutationZeit = Date.now()
          if (
            [
              'links',
              'schluessel',
              'mobileAbos',
              'telefones',
              'funktionen',
              'etiketten',
            ].includes(parentModel)
          ) {
            // set persons letzteMutation
            const { location } = self
            const idPerson = ifIsNumericAsNumber(location[1])
            self.updatePersonsMutation(idPerson)
          }
          if (['kostenstellen'].includes(parentModel)) {
            // set sektions letzteMutation
            const { location } = self
            const idSektion = ifIsNumericAsNumber(location[1])
            self.updateSektionsMutation(idSektion)
          }
          setErrors({})
        },
        updatePersonsMutation(idPerson) {
          // in db
          try {
            db.prepare(
              `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({
              user: self.username,
              time: Date.now(),
              id: idPerson,
            })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.personen.find(p => p.id === idPerson)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        updateAmtMutation(idAmt) {
          // in db
          try {
            db.prepare(
              `update aemter set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({
              user: self.username,
              time: Date.now(),
              id: idAmt,
            })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const amt = self.aemter.find(p => p.id === idAmt)
          amt.letzteMutationUser = self.username
          amt.letzteMutationZeit = Date.now()
        },
        updateAbteilungsMutation(idAbteilung) {
          // in db
          try {
            db.prepare(
              `update abteilungen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({
              user: self.username,
              time: Date.now(),
              id: idAbteilung,
            })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const abteilung = self.abteilungen.find(p => p.id === idAbteilung)
          abteilung.letzteMutationUser = self.username
          abteilung.letzteMutationZeit = Date.now()
        },
        updateBereichsMutation(idBereich) {
          // in db
          try {
            db.prepare(
              `update bereiche set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({
              user: self.username,
              time: Date.now(),
              id: idBereich,
            })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.bereiche.find(p => p.id === idBereich)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        updateSektionsMutation(idSektion) {
          // in db
          try {
            db.prepare(
              `update sektionen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
            ).run({
              user: self.username,
              time: Date.now(),
              id: idSektion,
            })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.sektionen.find(p => p.id === idSektion)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        setSettings(value) {
          self.settings = value
        },
        setSettingsKey({ key, value }) {
          try {
            db.prepare(`update settings set ${key} = ? where id = 1`).run(value)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          self.settings = {
            ...self.settings,
            [key]: value,
          }
        },
        addError(error) {
          // cannnot pop, need to set new value
          // or the change will not be observed
          // use uniq in case multiple same messages arrive
          self.errors = uniqBy([...self.errors, error], 'message')
          setTimeout(() => {
            // need to use an action inside timeout
            self.popError()
          }, 1000 * 10)
        },
        popError() {
          // eslint-disable-next-line no-unused-vars
          const [first, ...last] = self.errors
          self.errors = [...last]
        },
      }
    })

export let undoManager = {}
export const setUndoManager = targetStore => {
  undoManager = targetStore.history
}
