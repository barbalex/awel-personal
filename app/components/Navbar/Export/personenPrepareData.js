export default ({ store }) =>
  store.personenFiltered
    .slice()
    .map(p => {
      const amt = store.aemter.find(a => a.id === p.amt) || {}
      p.amt_id = amt.id || ''
      p.amt_name = amt.name || ''
      delete p.amt
      return p
    })
    .map(p => {
      const abteilung = store.abteilungen.find(a => a.id === p.abteilung) || {}
      p.abteilung_id = abteilung.id || ''
      p.abteilung_name = abteilung.name || ''
      delete p.abteilung
      return p
    })
    .map(p => {
      const sektion = store.sektionen.find(a => a.id === p.sektion) || {}
      p.sektion_id = sektion.id || ''
      p.sektion_name = sektion.name || ''
      delete p.sektion
      return p
    })
    .map(p => {
      const bereich = store.bereiche.find(a => a.id === p.bereich) || {}
      p.bereich_id = bereich.id || ''
      p.bereich_name = bereich.name || ''
      delete p.bereich
      return p
    })
