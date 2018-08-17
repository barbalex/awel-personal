import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

export default types
  .model('Person', {
    id: types.integer,
    deleted: types.optional(types.integer, 0),
    name: types.maybeNull(types.string),
    vorname: types.maybeNull(types.string),
    kurzzeichen: types.maybeNull(types.string),
    telefonNr: types.maybeNull(types.string),
    telefonNrMobile: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    geburtDatum: types.maybeNull(types.string),
    bueroNr: types.maybeNull(types.string),
    abteilung: types.maybeNull(types.string),
    kostenstelle: types.maybeNull(types.string),
    vorgesetztId: types.maybeNull(types.integer),
    eintrittDatum: types.maybeNull(types.string),
    austrittDatum: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    parkplatzNr: types.maybeNull(types.string),
    parkplatzBeitrag: types.maybeNull(types.string),
    geschlecht: types.maybeNull(types.string),
    bemerkungen: types.maybeNull(types.string),
    letzteMutationZeit: types.maybeNull(types.string),
    letzteMutationUser: types.maybeNull(types.string)
  })
  .actions(self => ({
    setField({ field, value, id }) {
      const { db } = app
      try {
        db.prepare(`update person set ${field} = @value where id = @id;`).run({
          value,
          id
        })
      } catch (error) {
        return console.log(error)
      }
      self[field] = value
    }
  }))
