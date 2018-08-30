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
  onPatch(personen, (patch, inversePatch) =>
    /**
     * setTimeout is needed so that by the time store.addMutation runs,
     * undoManager lists the inverse patch of the deletion
     * and so addMutation can save the previous value
     */
    setTimeout(() =>
      addMutation({ tableName: 'personen', patch, inversePatch })
    )
  )
  onPatch(links, patch =>
    setTimeout(() => addMutation({ tableName: 'links', patch }))
  )
  onPatch(schluessel, patch =>
    setTimeout(() => addMutation({ tableName: 'schluessel', patch }))
  )
  onPatch(mobileAbos, patch =>
    setTimeout(() => addMutation({ tableName: 'mobileAbos', patch }))
  )
  onPatch(kaderFunktionen, patch =>
    setTimeout(() => addMutation({ tableName: 'kaderFunktionen', patch }))
  )
  onPatch(etiketten, patch =>
    setTimeout(() => addMutation({ tableName: 'etiketten', patch }))
  )
  onPatch(statusWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'statusWerte', patch }))
  )
  onPatch(geschlechtWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'geschlechtWerte', patch }))
  )
  onPatch(abteilungWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'abteilungWerte', patch }))
  )
  onPatch(kostenstelleWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'kostenstelleWerte', patch }))
  )
  onPatch(mobileAboTypWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'mobileAboTypWerte', patch }))
  )
  onPatch(kaderFunktionWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'kaderFunktionWerte', patch }))
  )
  onPatch(mobileAboKostenstelleWerte, patch =>
    setTimeout(() =>
      addMutation({ tableName: 'mobileAboKostenstelleWerte', patch })
    )
  )
  onPatch(etikettWerte, patch =>
    setTimeout(() => addMutation({ tableName: 'etikettWerte', patch }))
  )
}
