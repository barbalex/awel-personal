import { types } from 'mobx-state-tree'

export default types.model('Person', {
  id: types.integer,
  deleted: types.optional(types.integer, 0),
  name: types.union(types.string, types.integer, types.null),
  vorname: types.union(types.string, types.integer, types.null),
  kurzzeichen: types.union(types.string, types.integer, types.null),
  telefonNr: types.union(types.string, types.integer, types.null),
  telefonNrMobile: types.union(types.string, types.integer, types.null),
  email: types.union(types.string, types.integer, types.null),
  geburtDatum: types.union(types.string, types.integer, types.null),
  bueroNr: types.union(types.string, types.integer, types.null),
  abteilung: types.union(types.string, types.integer, types.null),
  kostenstelle: types.union(types.string, types.integer, types.null),
  vorgesetztId: types.maybeNull(types.integer),
  eintrittDatum: types.union(types.string, types.integer, types.null),
  austrittDatum: types.union(types.string, types.integer, types.null),
  status: types.union(types.string, types.integer, types.null),
  parkplatzNr: types.union(types.string, types.integer, types.null),
  parkplatzBeitrag: types.union(types.string, types.integer, types.null),
  geschlecht: types.union(types.string, types.integer, types.null),
  bemerkungen: types.union(types.string, types.integer, types.null),
  letzteMutationZeit: types.union(types.string, types.integer, types.null),
  letzteMutationUser: types.union(types.string, types.integer, types.null)
})
