// TODO: add data referenced data
export default ({ store }) =>
  store.personenFiltered
    .slice()
    .map(p => {
      const amt = store.aemter.find(a => a.id === p.amt)
      if (!amt) return p
      p.amt_id = amt.id
      p.amt_name = amt.name
      delete p.amt
      return p
    })
    .map(p => {
      const abteilung = store.abteilungen.find(a => a.id === p.abteilung)
      if (!abteilung) return p
      p.amt_id = abteilung.id
      p.amt_name = abteilung.name
      delete p.abteilung
      return p
    })
    .map(p => {
      const sektion = store.sektionen.find(a => a.id === p.sektion)
      if (!sektion) return p
      p.amt_id = sektion.id
      p.amt_name = sektion.name
      delete p.sektion
      return p
    })
    .map(p => {
      const bereich = store.bereiche.find(a => a.id === p.bereich)
      if (!bereich) return p
      p.amt_id = bereich.id
      p.amt_name = bereich.name
      delete p.bereich
      return p
    })
