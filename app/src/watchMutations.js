import { onPatch } from 'mobx-state-tree'

export default ({ store }) => {
  const {
    addMutation,
    personen,
    links,
    schluessel,
    mobileAbos,
    telefones,
    funktionen,
    etiketten,
    statusWerte,
    anredeWerte,
    kostenstelleWerte,
    mobileAboTypWerte,
    telefonTypWerte,
    schluesselTypWerte,
    schluesselAnlageWerte,
    funktionWerte,
    mobileAboKostenstelleWerte,
    etikettWerte,
    landWerte,
    mutationartWerte,
    standortWerte,
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
  onPatch(telefones, (patch, inversePatch) =>
    addMutation({ tableName: 'telefones', patch, inversePatch }),
  )
  onPatch(funktionen, (patch, inversePatch) =>
    addMutation({ tableName: 'funktionen', patch, inversePatch }),
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
  onPatch(telefonTypWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'telefonTypWerte', patch, inversePatch }),
  )
  onPatch(schluesselTypWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'schluesselTypWerte', patch, inversePatch }),
  )
  onPatch(schluesselAnlageWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'schluesselAnlageWerte', patch, inversePatch }),
  )
  onPatch(funktionWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'funktionWerte', patch, inversePatch }),
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
  onPatch(mutationartWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'mutationartWerte', patch, inversePatch }),
  )
  onPatch(standortWerte, (patch, inversePatch) =>
    addMutation({ tableName: 'standortWerte', patch, inversePatch }),
  )
}
