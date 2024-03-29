import { types, splitJsonPath } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import findIndex from 'lodash/findIndex'
import flatten from 'lodash/flatten'
import findLast from 'lodash/findLast'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import last from 'lodash/last'

import Amt from './Amt'
import Abteilung from './Abteilung'
import Settings from './Settings'
import Bereich from './Bereich'
import Sektion from './Sektion'
import Etikett from './Etikett'
import Anwesenheitstag from './Anwesenheitstag'
import AnredeWert from './AnredeWert'
import FunktionWert from './FunktionWert'
import KaderFunktionWert from './KaderFunktionWert'
import KostenstelleWert from './KostenstelleWert'
import Link from './Link'
import Schluessel from './Schluessel'
import MobileAbo from './MobileAbo'
import Telefon from './Telefon'
import Funktion from './Funktion'
import KaderFunktion from './KaderFunktion'
import MobileAboKostenstelleWert from './MobileAboKostenstelleWert'
import MobileAboTypWert from './MobileAboTypWert'
import TelefonTypWert from './TelefonTypWert'
import SchluesselTypWert from './SchluesselTypWert'
import SchluesselAnlageWert from './SchluesselAnlageWert'
import EtikettWert from './EtikettWert'
import AnwesenheitstagWert from './AnwesenheitstagWert'
import LandWert from './LandWert'
import MutationartWert from './MutationartWert'
import StandortWert from './StandortWert'
import Person from './Person'
import Mutation from './Mutation'
import StatusWert from './StatusWert'
import TagWert from './TagWert'
import PersonPages from './PersonPages'
import PersonVerzeichnisPages from './PersonVerzeichnisPages'
import personenFiltered from './personenFiltered'
import personenSorted from './personenSorted'
import personenSortedByHandlungsbedarf from './personenSortedByHandlungsbedarf'
import aemterFiltered from './aemterFiltered'
import aemterFilteredSortedByHandlungsbedarf from './aemterFilteredSortedByHandlungsbedarf'
import abteilungenFiltered from './abteilungenFiltered'
import abteilungenFilteredSortedByHandlungsbedarf from './abteilungenFilteredSortedByHandlungsbedarf'
import bereicheFiltered from './bereicheFiltered'
import bereicheFilteredSortedByHandelsbedarf from './bereicheFilteredSortedByHandelsbedarf'
import sektionenFiltered from './sektionenFiltered'
import sektionenFilteredSortedByHandelsbedarf from './sektionenFilteredSortedByHandelsbedarf'
import revertMutation from './revertMutation'

const store = () =>
  types
    .model({
      dirty: types.optional(types.boolean, false),
      deletionMessage: types.maybeNull(types.string),
      deletionTitle: types.maybeNull(types.string),
      etiketten: types.array(Etikett),
      anwesenheitstage: types.array(Anwesenheitstag),
      anredeWerte: types.array(AnredeWert),
      funktionWerte: types.array(FunktionWert),
      kaderFunktionWerte: types.array(KaderFunktionWert),
      kostenstelleWerte: types.array(KostenstelleWert),
      links: types.array(Link),
      schluessel: types.array(Schluessel),
      mobileAbos: types.array(MobileAbo),
      telefones: types.array(Telefon),
      funktionen: types.array(Funktion),
      kaderFunktionen: types.array(KaderFunktion),
      mobileAboKostenstelleWerte: types.array(MobileAboKostenstelleWert),
      mobileAboTypWerte: types.array(MobileAboTypWert),
      telefonTypWerte: types.array(TelefonTypWert),
      schluesselTypWerte: types.array(SchluesselTypWert),
      schluesselAnlageWerte: types.array(SchluesselAnlageWert),
      etikettWerte: types.array(EtikettWert),
      anwesenheitstagWerte: types.array(AnwesenheitstagWert),
      landWerte: types.array(LandWert),
      mutationArtWerte: types.array(MutationartWert),
      standortWerte: types.array(StandortWert),
      personen: types.array(Person),
      aemter: types.array(Amt),
      abteilungen: types.array(Abteilung),
      settings: types.optional(Settings, {
        id: 1,
        schluesselFormPath: null,
        personMutationWeiterleiten: null,
      }),
      bereiche: types.array(Bereich),
      sektionen: types.array(Sektion),
      mutations: types.array(Mutation),
      showDeleted: types.optional(types.boolean, false),
      showMutationNoetig: types.optional(types.boolean, false),
      statusWerte: types.array(StatusWert),
      tagWerte: types.array(TagWert),
      username: types.maybe(types.string),
      watchMutations: types.optional(types.boolean, false),
      revertingMutationId: types.maybe(types.union(types.integer, types.null)),
      history: types.optional(UndoManager, {}),
      filterPerson: types.optional(Person, {}),
      filterPersonKader: types.optional(types.boolean, false),
      filterPersonAktivJetzt: types.optional(types.boolean, true),
      filterPersonAktivJetztMitTel: types.optional(types.boolean, false),
      filterPersonAktivJetztMitMobiltel: types.optional(types.boolean, false),
      filterPersonAktivJetztMitKurzzeichen: types.optional(
        types.boolean,
        false,
      ),
      filterAmt: types.optional(Amt, {}),
      filterAbteilung: types.optional(Abteilung, {}),
      filterBereich: types.optional(Bereich, {}),
      filterSektion: types.optional(Sektion, {}),
      filterEtikett: types.optional(Etikett, {}),
      filterAnwesenheitstage: types.optional(Anwesenheitstag, {}),
      filterLink: types.optional(Link, {}),
      filterSchluessel: types.optional(Schluessel, {}),
      filterMobileAbo: types.optional(MobileAbo, {}),
      filterTelefon: types.optional(Telefon, {}),
      filterFunktion: types.optional(Funktion, {}),
      filterKaderFunktion: types.optional(KaderFunktion, {}),
      showFilter: types.optional(types.boolean, false),
      filterFulltext: types.maybe(
        types.union(types.string, types.integer, types.null),
      ),
      activePrintForm: types.maybe(types.union(types.string, types.null)),
      printing: types.optional(types.boolean, false),
      personPages: types.optional(PersonPages, {
        pages: [],
        activePageIndex: 0,
        remainingRows: [],
        building: false,
        title: '',
      }),
      personVerzeichnis: types.optional(PersonVerzeichnisPages, {
        pages: [],
        activePageIndex: 0,
        remainingRows: [],
        building: false,
      }),
      pathname: types.optional(types.string, ''),
    })
    .volatile(() => ({
      deletionCallback: null,
      errors: [],
      db: null,
      navigate: undefined,
    }))
    .views((self) => ({
      get existsFilter() {
        const {
          filterPerson,
          filterPersonKader,
          filterPersonAktivJetzt,
          filterPersonAktivJetztMitTel,
          filterPersonAktivJetztMitMobiltel,
          filterPersonAktivJetztMitKurzzeichen,
          filterAmt,
          filterAbteilung,
          filterBereich,
          filterSektion,
          filterEtikett,
          filterAnwesenheitstage,
          filterLink,
          filterSchluessel,
          filterMobileAbo,
          filterTelefon,
          filterFunktion,
          filterKaderFunktion,
        } = self
        return (
          [
            ...Object.values(filterPerson),
            ...Object.values(filterAmt),
            ...Object.values(filterAbteilung),
            ...Object.values(filterBereich),
            ...Object.values(filterSektion),
            ...Object.values(filterEtikett),
            ...Object.values(filterAnwesenheitstage),
            ...Object.values(filterLink),
            ...Object.values(filterSchluessel),
            ...Object.values(filterMobileAbo),
            ...Object.values(filterTelefon),
            ...Object.values(filterFunktion),
            ...Object.values(filterKaderFunktion),
          ].filter((v) => v).length > 0 ||
          filterPersonKader ||
          filterPersonAktivJetzt ||
          filterPersonAktivJetztMitTel ||
          filterPersonAktivJetztMitMobiltel ||
          filterPersonAktivJetztMitKurzzeichen
        )
      },
      get personenSorted() {
        return personenSorted(self.personen)
      },
      get personenFiltered() {
        return personenFiltered({ self })
      },
      get personenFilteredSorted() {
        return personenSorted(self.personenFiltered)
      },
      get personenFilteredSortedByHandlungsbedarf() {
        return personenSortedByHandlungsbedarf(self)
      },
      get aemterFiltered() {
        return aemterFiltered(self)
      },
      get aemterFilteredSorted() {
        return self.aemterFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get aemterFilteredSortedByHandlungsbedarf() {
        return aemterFilteredSortedByHandlungsbedarf(self)
      },
      get abteilungenFiltered() {
        return abteilungenFiltered(self)
      },
      get abteilungenFilteredSorted() {
        return self.abteilungenFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get abteilungenFilteredSortedByHandlungsbedarf() {
        return abteilungenFilteredSortedByHandlungsbedarf(self)
      },
      get bereicheFiltered() {
        return bereicheFiltered(self)
      },
      get bereicheFilteredSorted() {
        return self.bereicheFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get bereicheFilteredSortedByHandelsbedarf() {
        return bereicheFilteredSortedByHandelsbedarf(self)
      },
      get sektionenFiltered() {
        return sektionenFiltered(self)
      },
      get sektionenFilteredSorted() {
        return self.sektionenFiltered.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'de-Ch'),
        )
      },
      get sektionenFilteredSortedByHandelsbedarf() {
        return sektionenFilteredSortedByHandelsbedarf(self)
      },
      get revertedMutationIds() {
        return self.mutations.filter((m) => !!m.reverts).map((m) => m.reverts)
      },
      get userRevertions() {
        return sortBy(
          self.mutations
            .filter((m) => m.user === self.username)
            .filter((m) => self.revertedMutationIds.includes(m.id)),
          'time',
        )
      },
      get userMutations() {
        // lists active user's mutations
        // that have not been reverted
        // and are themselves not revertions
        return sortBy(
          self.mutations
            .filter((m) => m.user === self.username)
            .filter((m) => !m.reverts)
            .filter((m) => !self.revertedMutationIds.includes(m.id)),
          'time',
        )
      },
      get lastUserMutation() {
        // revert this one to undo last action
        return last(self.userMutations)
      },
      get lastUserMutationRevertion() {
        // revert this one to revert last undo
        return last(self.userRevertions)
      },
    }))
    .actions((self) => {
      setUndoManager(self)

      return {
        setNavigate(val) {
          self.navigate = val
        },
        setPathname(val) {
          self.pathname = val
        },
        setDb(val) {
          self.db = val
        },
        setDirty(val) {
          self.dirty = val
        },
        setFilter({ model, value }) {
          self[model] = value
          if (self.filterFulltext) self.filterFulltext = null
        },
        setFilterFulltext(value) {
          self.filterFulltext = value
          // remove other filters
          if (value && self.existsFilter) self.emptyFilterButFulltext()
          if (self.showFilter) self.showFilter = false
        },
        emptyFilter() {
          self.filterPerson = {}
          self.filterPersonKader = false
          self.filterPersonAktivJetzt = false
          self.filterPersonAktivJetztMitTel = false
          self.filterPersonAktivJetztMitMobiltel = false
          self.filterPersonAktivJetztMitKurzzeichen = false
          self.filterAbteilung = {}
          self.filterBereich = {}
          self.filterSektion = {}
          self.filterAmt = {}
          self.filterEtikett = {}
          self.filterAnwesenheitstage = {}
          self.filterLink = {}
          self.filterSchluessel = {}
          self.filterKostenstelle = {}
          self.filterMobileAbo = {}
          self.filterTelefon = {}
          self.filterFunktion = {}
          self.filterKaderFunktion = {}
          self.filterFulltext = null
        },
        emptyFilterButFulltext() {
          self.filterPerson = {}
          self.filterPersonKader = false
          self.filterPersonAktivJetzt = false
          self.filterPersonAktivJetztMitTel = false
          self.filterPersonAktivJetztMitMobiltel = false
          self.filterPersonAktivJetztMitKurzzeichen = false
          self.filterAbteilung = {}
          self.filterBereich = {}
          self.filterSektion = {}
          self.filterAmt = {}
          self.filterEtikett = {}
          self.filterAnwesenheitstage = {}
          self.filterLink = {}
          self.filterSchluessel = {}
          self.filterKostenstelle = {}
          self.filterMobileAbo = {}
          self.filterTelefon = {}
          self.filterFunktion = {}
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
        setWatchMutations(val) {
          self.watchMutations = val
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
        setAnwesenheitstage(anwesenheitstage) {
          self.watchMutations = false
          self.anwesenheitstage = anwesenheitstage
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
        setShowMutationNoetig(show) {
          self.showMutationNoetig = show
        },
        setPrinting(val) {
          self.printing = val
        },
        setActivePrintForm(val) {
          self.personPages.reset()
          self.activePrintForm = val
        },
        revertMutation(mutationId) {
          revertMutation({ self, mutationId })
        },
        addPerson(val) {
          self.personen.push(val)
        },
        addAmt() {
          // 1. create new Amt in db, returning id
          let info
          try {
            info = self.db
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
          self.navigate(`/Aemter/${info.lastInsertRowid}`)
        },
        addAbteilung() {
          // 1. create new Abteilung in db, returning id
          let info
          try {
            info = self.db
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
          self.navigate(`/Abteilungen/${info.lastInsertRowid}`)
        },
        addBereich() {
          // 1. create new Bereich in db, returning id
          let info
          try {
            info = self.db
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
          self.navigate(`/Bereiche/${info.lastInsertRowid}`)
        },
        addSektion() {
          // 1. create new Sektion in db, returning id
          let info
          try {
            info = self.db
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
          self.navigate(`/Sektionen/${info.lastInsertRowid}`)
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
                  historyChanges.map((c) => c.inversePatches),
                )
                const historyInversePatch =
                  findLast(
                    historyInversePatches,
                    (p) =>
                      p.op === 'add' && p.path === `/${tableName}/${index}`,
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
              info = self.db
                .prepare(
                  'insert into mutations (time, user, op, tableName, rowId, field, value, previousValue, reverts) values (@time, @username, @op, @tableName, @rowId, @field, @value, @previousValue, @reverts)',
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
                  reverts: self.revertingMutationId,
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
              reverts: self.revertingMutationId,
            })
          })
          self.revertingMutationId = null
        },
        mutate(mutation) {
          self.mutations.push(mutation)
        },
        addWert(table) {
          // 1. create new value in db, returning id
          let info
          try {
            info = self.db
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
          self.navigate(`/Werte/${table}/${info.lastInsertRowid}`)
        },
        setWertDeleted({ id, table }) {
          // write to db
          try {
            self.db
              .prepare(`update ${table} set deleted = 1 where id = ?;`)
              .run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const dat = self[table].find((p) => p.id === id)
          dat.deleted = 1
          if (!self.showDeleted) self.navigate(`/Werte/${table}`)
        },
        deleteWert({ id, table }) {
          // write to db
          try {
            self.db.prepare(`delete from ${table} where id = ${id}`).run()
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self[table].splice(
            findIndex(self[table], (p) => p.id === id),
            1,
          )
          self.navigate(`/Werte/${table}`)
        },
        setPersonDeleted(id) {
          // write to db
          try {
            self.db
              .prepare(
                `update personen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const person = self.personen.find((p) => p.id === id)
          person.deleted = 1
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Personen`)
        },
        deletePerson(id) {
          // write to db
          try {
            self.db.prepare('delete from personen where id = ?').run(id)
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
          self.personen.splice(
            findIndex(self.personen, (p) => p.id === id),
            1,
          )
          self.navigate(`/Personen`)
        },
        setAmtDeleted(id) {
          // write to db
          try {
            self.db
              .prepare(
                `update aemter set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const amt = self.aemter.find((p) => p.id === id)
          amt.deleted = 1
          amt.letzteMutationUser = self.username
          amt.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Aemter`)
        },
        setAbteilungDeleted(id) {
          // write to db
          try {
            self.db
              .prepare(
                `update abteilungen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const abteilung = self.abteilungen.find((p) => p.id === id)
          abteilung.deleted = 1
          abteilung.letzteMutationUser = self.username
          abteilung.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Abteilungen`)
        },
        deleteAmt(id) {
          // write to db
          try {
            self.db.prepare('delete from aemter where id = ?').run(id)
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
          self.aemter.splice(
            findIndex(self.aemter, (p) => p.id === id),
            1,
          )
          self.navigate(`/Aemter`)
        },
        deleteAbteilung(id) {
          // write to db
          try {
            self.db.prepare('delete from abteilungen where id = ?').run(id)
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
            findIndex(self.abteilungen, (p) => p.id === id),
            1,
          )
          self.navigate(`/Abteilungen`)
        },
        setBereichDeleted(id) {
          // write to db
          try {
            self.db
              .prepare(
                `update bereiche set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const bereich = self.bereiche.find((p) => p.id === id)
          bereich.deleted = 1
          bereich.letzteMutationUser = self.username
          bereich.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Bereiche`)
        },
        deleteBereich(id) {
          // write to db
          try {
            self.db.prepare('delete from bereiche where id = ?').run(id)
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
          self.bereiche.splice(
            findIndex(self.bereiche, (p) => p.id === id),
            1,
          )
          self.navigate(`/Bereiche`)
        },
        setSektionDeleted(id) {
          // write to db
          try {
            self.db
              .prepare(
                `update sektionen set deleted = 1, letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({ id, user: self.username, time: Date.now() })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          const sektion = self.sektionen.find((p) => p.id === id)
          sektion.deleted = 1
          sektion.letzteMutationUser = self.username
          sektion.letzteMutationZeit = Date.now()
          if (!self.showDeleted) self.navigate(`/Sektionen`)
        },
        deleteSektion(id) {
          // write to db
          try {
            self.db.prepare('delete from sektionen where id = ?').run(id)
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
          self.sektionen.splice(
            findIndex(self.sektionen, (p) => p.id === id),
            1,
          )
          self.navigate(`/Sektionen`)
        },
        addEtikett({ etikett, personId }) {
          // 1. create new etikett in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into etiketten (idPerson, etikett, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(personId, etikett, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.etiketten.push({
            id: info.lastInsertRowid,
            etikett,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteEtikett({ etikett, personId }) {
          // write to db
          try {
            self.db
              .prepare(
                'delete from etiketten where idPerson = ? and etikett = ?',
              )
              .run(personId, etikett)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.etiketten.splice(
            findIndex(
              self.etiketten,
              (e) => e.idPerson === personId && e.etikett === etikett,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        addAnwesenheitstag({ tag, personId }) {
          // 1. create new anwesenheitstag in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into anwesenheitstage (idPerson, tag, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(personId, tag, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.anwesenheitstage.push({
            id: info.lastInsertRowid,
            tag,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteAnwesenheitstag({ tag, personId }) {
          // write to db
          try {
            self.db
              .prepare(
                'delete from anwesenheitstage where idPerson = ? and tag = ?',
              )
              .run(personId, tag)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.anwesenheitstage.splice(
            findIndex(
              self.anwesenheitstage,
              (e) => e.idPerson === personId && e.tag === tag,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        addLink({ url, personId }) {
          // 1. create new link in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into links (idPerson, url, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(personId, url, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.links.push({
            id: info.lastInsertRowid,
            url,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteLink({ id, personId }) {
          // write to db
          try {
            self.db.prepare('delete from links where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.links.splice(
            findIndex(self.links, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        addSchluessel(personId) {
          // 1. create new link in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into schluessel (idPerson, letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(personId, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.schluessel.push({
            id: info.lastInsertRowid,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteSchluessel({ id, personId }) {
          // write to db
          try {
            self.db.prepare('delete from schluessel where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.schluessel.splice(
            findIndex(self.schluessel, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        addMobileAbo(personId) {
          // 1. create new link in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into mobileAbos (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(personId, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.mobileAbos.push({
            id: info.lastInsertRowid,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        addTelefon(personId) {
          // 1. create new link in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into telefones (idPerson,letzteMutationUser, letzteMutationZeit) values (?,?,?)',
              )
              .run(personId, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.telefones.push({
            id: info.lastInsertRowid,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteMobileAbo({ id, personId }) {
          // write to db
          try {
            self.db.prepare('delete from mobileAbos where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.mobileAbos.splice(
            findIndex(self.mobileAbos, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        deleteTelefon({ id, personId }) {
          // write to db
          try {
            self.db.prepare('delete from telefones where id = ?').run(id)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.telefones.splice(
            findIndex(self.telefones, (p) => p.id === id),
            1,
          )
          // set persons letzteMutation
          self.updatePersonsMutation(personId)
        },
        addFunktion({ funktion, personId }) {
          // 1. create new funktion in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into funktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(personId, funktion, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.funktionen.push({
            id: info.lastInsertRowid,
            funktion,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteFunktion({ funktion, personId }) {
          // write to db
          try {
            self.db
              .prepare(
                'delete from funktionen where idPerson = ? and funktion = ?',
              )
              .run(personId, funktion)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.funktionen.splice(
            findIndex(
              self.funktionen,
              (e) => e.idPerson === personId && e.funktion === funktion,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        addKaderFunktion({ funktion, personId }) {
          // 1. create new kaderFunktion in db, returning id
          let info
          try {
            info = self.db
              .prepare(
                'insert into kaderFunktionen (idPerson, funktion, letzteMutationUser, letzteMutationZeit) values (?, ?, ?, ?)',
              )
              .run(personId, funktion, self.username, Date.now())
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // 2. add to store
          self.kaderFunktionen.push({
            id: info.lastInsertRowid,
            funktion,
            idPerson: personId,
            letzteMutationUser: self.username,
            letzteMutationZeit: Date.now(),
          })
          self.updatePersonsMutation(personId)
        },
        deleteKaderFunktion({ funktion, personId }) {
          // write to db
          try {
            self.db
              .prepare(
                'delete from kaderFunktionen where idPerson = ? and funktion = ?',
              )
              .run(personId, funktion)
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // write to store
          self.kaderFunktionen.splice(
            findIndex(
              self.kaderFunktionen,
              (e) => e.idPerson === personId && e.funktion === funktion,
            ),
            1,
          )
          self.updatePersonsMutation(personId)
        },
        updateField({
          table,
          parentModel,
          field,
          value,
          id,
          setErrors,
          personId,
        }) {
          // 1. update in db
          try {
            self.db
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
            if (setErrors) {
              return setErrors({
                [field]: error.message,
              })
            }
            self.addError(error)
            return
          }
          // 2. update in store
          const storeObject = self[parentModel].find((o) => o.id === id)
          if (!storeObject) {
            if (setErrors) {
              return setErrors({
                [field]: `Error: no ${table} with id "${id}" found in store`,
              })
            } else {
              self.addError(`Error: no ${table} with id "${id}" found in store`)
            }
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
              'kaderFunktionen',
              'etiketten',
              'anwesenheitstage',
            ].includes(parentModel) &&
            personId
          ) {
            // set persons letzteMutation
            self.updatePersonsMutation(personId)
          }
          if (setErrors) setErrors({})
        },
        updatePersonsMutation(idPerson) {
          // in db
          try {
            self.db
              .prepare(
                `update personen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({
                user: self.username,
                time: Date.now(),
                id: idPerson,
              })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.personen.find((p) => p.id === idPerson)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        updateAmtMutation(idAmt) {
          // in db
          try {
            self.db
              .prepare(
                `update aemter set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({
                user: self.username,
                time: Date.now(),
                id: idAmt,
              })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const amt = self.aemter.find((p) => p.id === idAmt)
          amt.letzteMutationUser = self.username
          amt.letzteMutationZeit = Date.now()
        },
        updateAbteilungsMutation(idAbteilung) {
          // in db
          try {
            self.db
              .prepare(
                `update abteilungen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({
                user: self.username,
                time: Date.now(),
                id: idAbteilung,
              })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const abteilung = self.abteilungen.find((p) => p.id === idAbteilung)
          abteilung.letzteMutationUser = self.username
          abteilung.letzteMutationZeit = Date.now()
        },
        updateBereichsMutation(idBereich) {
          // in db
          try {
            self.db
              .prepare(
                `update bereiche set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({
                user: self.username,
                time: Date.now(),
                id: idBereich,
              })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.bereiche.find((p) => p.id === idBereich)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        updateSektionsMutation(idSektion) {
          // in db
          try {
            self.db
              .prepare(
                `update sektionen set letzteMutationUser = @user, letzteMutationZeit = @time where id = @id;`,
              )
              .run({
                user: self.username,
                time: Date.now(),
                id: idSektion,
              })
          } catch (error) {
            self.addError(error)
            return console.log(error)
          }
          // in store
          const person = self.sektionen.find((p) => p.id === idSektion)
          person.letzteMutationUser = self.username
          person.letzteMutationZeit = Date.now()
        },
        setSettings(value) {
          self.settings = value
        },
        setSettingsKey({ key, value }) {
          try {
            self.db
              .prepare(`update settings set ${key} = ? where id = 1`)
              .run(value)
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
        setFilterPersonKader(val) {
          self.emptyFilter()
          self.filterPersonKader = val
        },
        setFilterPersonAktivJetzt(val) {
          self.emptyFilter()
          self.filterPersonAktivJetzt = val
        },
        setFilterPersonAktivJetztMitTel(val) {
          self.emptyFilter()
          self.filterPersonAktivJetztMitTel = val
        },
        setFilterPersonAktivJetztMitMobiltel(val) {
          self.emptyFilter()
          self.filterPersonAktivJetztMitMobiltel = val
        },
        setFilterPersonAktivJetztMitKurzzeichen(val) {
          self.emptyFilter()
          self.filterPersonAktivJetztMitKurzzeichen = val
        },
      }
    })

export let undoManager = {}
export const setUndoManager = (targetStore) => {
  undoManager = targetStore.history
}

export default store
