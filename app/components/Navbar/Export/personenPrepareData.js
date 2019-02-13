// TODO: add data referenced data
export default ({ store }) =>
  store.personenFiltered.slice().map(p => {
    const amt = store.aemter.find(a => a.id === p.amt)
    if (!amt) return p
    p.amt_id = amt.id
    p.amt_name = amt.name
    delete p.amt
    return p
  })
