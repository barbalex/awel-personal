import { getSnapshot } from 'mobx-state-tree'

export default ({ store }) => {
  const pureStore = getSnapshot(store)
  const {
    personenFiltered,
    aemter,
    abteilungen,
    sektionen,
    bereiche,
  } = pureStore
  console.log({
    pureStore,
    personenFiltered,
    aemter,
    abteilungen,
    sektionen,
    bereiche,
  })

  return store.personenFiltered
    .slice()
    .map(p => {
      const amt = aemter.find(a => a.id === p.amt) || {}
      p.amt_id = amt.id || ''
      p.amt_name = amt.name || ''
      delete p.amt
      return p
    })
    .map(p => {
      const abteilung = abteilungen.find(a => a.id === p.abteilung) || {}
      p.amt_id = abteilung.id || ''
      p.amt_name = abteilung.name || ''
      delete p.abteilung
      return p
    })
    .map(p => {
      const sektion = sektionen.find(a => a.id === p.sektion) || {}
      p.amt_id = sektion.id || ''
      p.amt_name = sektion.name || ''
      delete p.sektion
      return p
    })
    .map(p => {
      const bereich = bereiche.find(a => a.id === p.bereich) || {}
      p.amt_id = bereich.id || ''
      p.amt_name = bereich.name || ''
      delete p.bereich
      return p
    })
}
