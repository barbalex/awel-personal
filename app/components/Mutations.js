// @flow
import React from 'react'
import compose from 'recompose/compose'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import ErrorBoundary from './shared/ErrorBoundary'
import fetchMutations from '../src/fetchMutations'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when Mutations is built
const Container = styled.div`
  height: calc(100% - 56px);
`

const enhance = compose(
  inject('store'),
  withLifecycle({
    onDidMount() {
      fetchMutations()
    }
  }),
  observer
)

const Mutations = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const mutation = store.mutations.find(p => p.id === activeId)

  return (
    <Container>
      <ErrorBoundary>
        <div>Mutations</div>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(Mutations)
