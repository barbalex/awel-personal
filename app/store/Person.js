import { types } from 'mobx-state-tree'
import app from 'ampersand-app'

export default types
  .model('Person', {
    id: types.integer,
    deleted: types.optional(types.integer, 0),
    name: types.maybeNull(types.union(types.string, types.integer)),
    vorname: types.maybeNull(types.union(types.string, types.integer)),
    kurzzeichen: types.maybeNull(types.union(types.string, types.integer)),
    telefonNr: types.maybeNull(types.union(types.string, types.integer)),
    telefonNrMobile: types.maybeNull(types.union(types.string, types.integer)),
    email: types.maybeNull(types.union(types.string, types.integer)),
    geburtDatum: types.maybeNull(types.union(types.string, types.integer)),
    bueroNr: types.maybeNull(types.union(types.string, types.integer)),
    abteilung: types.maybeNull(types.union(types.string, types.integer)),
    kostenstelle: types.maybeNull(types.union(types.string, types.integer)),
    vorgesetztId: types.maybeNull(types.integer),
    eintrittDatum: types.maybeNull(types.union(types.string, types.integer)),
    austrittDatum: types.maybeNull(types.union(types.string, types.integer)),
    status: types.maybeNull(types.union(types.string, types.integer)),
    parkplatzNr: types.maybeNull(types.union(types.string, types.integer)),
    parkplatzBeitrag: types.maybeNull(types.union(types.string, types.integer)),
    geschlecht: types.maybeNull(types.union(types.string, types.integer)),
    bemerkungen: types.maybeNull(types.union(types.string, types.integer)),
    letzteMutationZeit: types.maybeNull(
      types.union(types.string, types.integer)
    ),
    letzteMutationUser: types.maybeNull(
      types.union(types.string, types.integer)
    )
  })
  .actions(self => ({
    setField({ field, value, id }) {
      try {
        app.db
          .prepare(`update person set ${field} = @value where id = @id;`)
          .run({
            value,
            id
          })
      } catch (error) {
        return console.log(error)
      }
      self[field] = value
    }
  }))
