import fetchAnwesenheitstage from '../src/fetchAnwesenheitstage'

export default ({ store }) => {
  const { db, username, personen, addError, setLocation } = store
  // 1. create new Person in db, returning id
  let info
  try {
    info = db
      .prepare(
        'insert into personen (letzteMutationUser, letzteMutationZeit, land) values (@user, @zeit, @land)',
      )
      .run({ user: username, zeit: Date.now(), land: 'Schweiz' })
  } catch (error) {
    addError(error)
    return console.log(error)
  }
  // 2. add to store
  personen.push({
    id: info.lastInsertRowid,
    letzteMutationUser: username,
    letzteMutationZeit: Date.now(),
    land: 'Schweiz',
  })
  setLocation(['Personen', info.lastInsertRowid.toString()])
  // 3 requery anwesenheitstage (are added in db by trigger)
  fetchAnwesenheitstage({
    store,
  })
}
