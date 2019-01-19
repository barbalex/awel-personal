import { types } from 'mobx-state-tree'

export default types.model('Person', {
  id: types.maybe(types.integer),
  deleted: types.optional(types.integer, 0),
  personalNr: types.maybe(types.union(types.integer, types.null)),
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  vorname: types.maybe(types.union(types.string, types.integer, types.null)),
  kurzzeichen: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  adresse: types.maybe(types.union(types.string, types.integer, types.null)),
  plz: types.maybe(types.union(types.integer, types.null)),
  ort: types.maybe(types.union(types.string, types.integer, types.null)),
  land: types.maybe(types.union(types.string, types.integer, types.null)),
  bildUrl: types.maybe(types.union(types.string, types.integer, types.null)),
  email: types.maybe(types.union(types.string, types.integer, types.null)),
  geburtDatum: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  bueroNr: types.maybe(types.union(types.string, types.integer, types.null)),
  amt: types.maybe(types.union(types.integer, types.null)),
  abteilung: types.maybe(types.union(types.integer, types.null)),
  sektion: types.maybe(types.union(types.integer, types.null)),
  bereich: types.maybe(types.union(types.string, types.integer, types.null)),
  vorgesetztId: types.maybeNull(types.integer),
  eintrittDatum: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  austrittDatum: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  status: types.maybe(types.union(types.string, types.integer, types.null)),
  parkplatzNr: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  parkplatzBeitrag: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  anrede: types.maybe(types.union(types.string, types.integer, types.null)),
  bemerkungen: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  beschaeftigungsgrad: types.maybe(types.union(types.integer, types.null)),
  letzteMutationZeit: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  letzteMutationUser: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
})
