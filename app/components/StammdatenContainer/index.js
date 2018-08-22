// @flow
import React from 'react'
import compose from 'recompose/compose'
import withLifecycle from '@hocs/with-lifecycle'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import ErrorBoundary from '../shared/ErrorBoundary'
import Data from './Data'
import List from './List'
import fetchWerte from '../../src/fetchWerte'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when StammdatenContainer is built
const Container = styled.div`
  height: calc(100% - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  > div {
    height: unset !important;
  }
`

const enhance = compose(
  inject('store'),
  withLifecycle({
    onDidMount() {
      // TODO: fetch only needed?
      fetchWerte('statusWerte')
      fetchWerte('geschlechtWerte')
      fetchWerte('abteilungWerte')
      fetchWerte('kostenstelleWerte')
      fetchWerte('mobileAboTypWerte')
      fetchWerte('kaderFunktionWerte')
      fetchWerte('mobileAboKostenstelleWerte')
      fetchWerte('etikettWerte')
    }
  }),
  observer
)

const StammdatenContainer = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  const activeTable = location[0]
  let activeId = location[1]
  if (!isNaN(activeId)) activeId = +activeId

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={0.33}
            propagateDimensions
            renderOnResizeRate={100}
            renderOnResize
          >
            <List activeId={activeId} activeTable={activeTable} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement>
            <Data activeId={activeId} activeTable={activeTable} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(StammdatenContainer)