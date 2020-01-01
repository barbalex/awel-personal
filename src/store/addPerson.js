import fetchAnwesenheitstage from '../src/fetchAnwesenheitstage'

export default ({ self, db }) => {
  // 1. create new Person in db, returning id
  let info
  try {
    info = db
      .prepare(
        'insert into personen (letzteMutationUser, letzteMutationZeit, land) values (@user, @zeit, @land)',
      )
      .run({ user: self.username, zeit: Date.now(), land: 'Schweiz' })
  } catch (error) {
    self.addError(error)
    return console.log(error)
  }
  // 2. add to store
  self.personen.push({
    id: info.lastInsertRowid,
    letzteMutationUser: self.username,
    letzteMutationZeit: Date.now(),
    land: 'Schweiz',
  })
  self.setLocation(['Personen', info.lastInsertRowid.toString()])
  // 3 requery anwesenheitstage (are added in db by trigger)
  fetchAnwesenheitstage({
    db,
    setAnwesenheitstage: self.setAnwesenheitstage,
  })
}
