import pick from 'lodash/pick'

const adressenFields = ['name', 'vorname', 'adresse', 'plz', 'ort', 'land']

export default ({ store }) =>
  store.personenFiltered.slice().map(p => pick(p, adressenFields))
