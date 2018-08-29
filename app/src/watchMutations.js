// @flow
import { onPatch } from 'mobx-state-tree'
import app from 'ampersand-app'

export default () => {
  const { store } = app
  const { addMutation, personen } = store
  onPatch(personen, patch => addMutation({ model: 'personen', patch }))
  // TODO: add more
}
