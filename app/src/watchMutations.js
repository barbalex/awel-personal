// @flow
import { onPatch } from 'mobx-state-tree'
import app from 'ampersand-app'

export default () => {
  const { store } = app
  const {
    addMutation,
    personen,
    links,
    schluessel,
    mobileAbos,
    kaderFunktionen,
    etiketten,
    statusWerte,
    geschlechtWerte,
    abteilungWerte,
    kostenstelleWerte,
    mobileAboTypWerte,
    kaderFunktionWerte,
    mobileAboKostenstelleWerte,
    etikettWerte
  } = store
  onPatch(personen, patch => addMutation({ tableName: 'personen', patch }))
  onPatch(links, patch => addMutation({ tableName: 'links', patch }))
  onPatch(schluessel, patch => addMutation({ tableName: 'schluessel', patch }))
  onPatch(mobileAbos, patch => addMutation({ tableName: 'mobileAbos', patch }))
  onPatch(kaderFunktionen, patch =>
    addMutation({ tableName: 'kaderFunktionen', patch })
  )
  onPatch(etiketten, patch => addMutation({ tableName: 'etiketten', patch }))
  onPatch(statusWerte, patch =>
    addMutation({ tableName: 'statusWerte', patch })
  )
  onPatch(geschlechtWerte, patch =>
    addMutation({ tableName: 'geschlechtWerte', patch })
  )
  onPatch(abteilungWerte, patch =>
    addMutation({ tableName: 'abteilungWerte', patch })
  )
  onPatch(kostenstelleWerte, patch =>
    addMutation({ tableName: 'kostenstelleWerte', patch })
  )
  onPatch(mobileAboTypWerte, patch =>
    addMutation({ tableName: 'mobileAboTypWerte', patch })
  )
  onPatch(kaderFunktionWerte, patch =>
    addMutation({ tableName: 'kaderFunktionWerte', patch })
  )
  onPatch(mobileAboKostenstelleWerte, patch =>
    addMutation({ tableName: 'mobileAboKostenstelleWerte', patch })
  )
  onPatch(etikettWerte, patch =>
    addMutation({ tableName: 'etikettWerte', patch })
  )
}
