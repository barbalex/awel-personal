// @flow
import { onPatch } from 'mobx-state-tree'

export default ({ store }) => {
  const {
    addMutation,
    personen,
    links,
    schluessel,
    mobileAbos,
    kaderFunktionen,
    etiketten,
    statusWerte,
    anredeWerte,
    kostenstelleWerte,
    mobileAboTypWerte,
    kaderFunktionWerte,
    mobileAboKostenstelleWerte,
    etikettWerte,
    landWerte,
  } = store
  onPatch(personen, (patch, inversePatch) =>
    addMutation({ tableName: 'personen', patch, inversePatch }),
  )
  onPatch(links, (patch, inversePatch) =>
    addMutation({ tableName: 'links', patch, inversePatch }),
  )
  onPatch(schluessel, (patch, inversePatch) =>
    addMutation({ tableName: 'schluessel', patch, inversePatch }),
  )
  onPatch(mobileAbos, (patch, inversePatch) =>
    addMutation({ tableName: 'mobileAbos', patch, inversePatch }),
  )
  onPatch(kaderFunktionen, (patch, inversePatch) =>
    addMutation({ tableName: 'kaderFunktionen', patch, inversePatch }),
  )
  onPatch(etiketten, (patch, inversePatch) =>
    addMutation({ tableName: 'etiketten', patch, inversePatch }),
  )
  onPatch(statusWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'statusWerte', patch, inversePatch }),
  )
  onPatch(anredeWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'anredeWerte', patch, inversePatch }),
  )
  onPatch(kostenstelleWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'kostenstelleWerte', patch, inversePatch }),
  )
  onPatch(mobileAboTypWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'mobileAboTypWerte', patch, inversePatch }),
  )
  onPatch(kaderFunktionWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'kaderFunktionWerte', patch, inversePatch }),
  )
  onPatch(mobileAboKostenstelleWerte, (patch, inversePatch) =>
    addMutation({
      tableName: 'mobileAboKostenstelleWerte',
      patch,
      inversePatch,
    }),
  )
  onPatch(etikettWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'etikettWerte', patch, inversePatch }),
  )
  onPatch(landWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'landWerte', patch, inversePatch }),
  )
}
