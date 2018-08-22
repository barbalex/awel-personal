import { types } from 'mobx-state-tree'

export default types.model('Person', {
  id: types.integer,
  deleted: types.optional(types.integer, 0),
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  vorname: types.maybe(types.union(types.string, types.integer, types.null)),
  kurzzeichen: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  telefonNr: types.maybe(types.union(types.string, types.integer, types.null)),
  telefonNrMobile: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  email: types.maybe(types.union(types.string, types.integer, types.null)),
  geburtDatum: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  bueroNr: types.maybe(types.union(types.string, types.integer, types.null)),
  abteilung: types.maybe(types.union(types.string, types.integer, types.null)),
  kostenstelle: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  vorgesetztId: types.maybeNull(types.integer),
  eintrittDatum: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  austrittDatum: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  status: types.maybe(types.union(types.string, types.integer, types.null)),
  parkplatzNr: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  parkplatzBeitrag: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  geschlecht: types.maybe(types.union(types.string, types.integer, types.null)),
  bemerkungen: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  letzteMutationZeit: types.maybe(
    types.union(types.string, types.integer, types.null)
  ),
  letzteMutationUser: types.maybe(
    types.union(types.string, types.integer, types.null)
  )
})
