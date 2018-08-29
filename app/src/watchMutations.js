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
  onPatch(personen, patch => addMutation({ model: 'personen', patch }))
  onPatch(links, patch => addMutation({ model: 'links', patch }))
  onPatch(schluessel, patch => addMutation({ model: 'schluessel', patch }))
  onPatch(mobileAbos, patch => addMutation({ model: 'mobileAbos', patch }))
  onPatch(kaderFunktionen, patch =>
    addMutation({ model: 'kaderFunktionen', patch })
  )
  onPatch(etiketten, patch => addMutation({ model: 'etiketten', patch }))
  onPatch(statusWerte, patch => addMutation({ model: 'statusWerte', patch }))
  onPatch(geschlechtWerte, patch =>
    addMutation({ model: 'geschlechtWerte', patch })
  )
  onPatch(abteilungWerte, patch =>
    addMutation({ model: 'abteilungWerte', patch })
  )
  onPatch(kostenstelleWerte, patch =>
    addMutation({ model: 'kostenstelleWerte', patch })
  )
  onPatch(mobileAboTypWerte, patch =>
    addMutation({ model: 'mobileAboTypWerte', patch })
  )
  onPatch(kaderFunktionWerte, patch =>
    addMutation({ model: 'kaderFunktionWerte', patch })
  )
  onPatch(mobileAboKostenstelleWerte, patch =>
    addMutation({ model: 'mobileAboKostenstelleWerte', patch })
  )
  console.log('etikettWerte:', { store, etikettWerte })
  onPatch(etikettWerte, patch => addMutation({ model: 'etikettWerte', patch }))
}
