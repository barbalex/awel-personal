// @flow
import React, { useEffect, useContext } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Data from './Data'
import List from './List'
import fetchWerte from '../../src/fetchWerte'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'
import dbContext from '../../dbContext'

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

const StammdatenContainer = () => {
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const location = store.location.toJSON()
  const activeTable = location[0]
  const activeId = ifIsNumericAsNumber(location[1])
  const data = store[activeTable]
  const dat = data.find(d => d.id === activeId)
  // pass list the active dat's props to enable instant updates
  const datJson = dat || {}

  useEffect(() => {
    fetchWerte({ db, store, table: 'statusWerte' })
    fetchWerte({ db, store, table: 'geschlechtWerte' })
    fetchWerte({ db, store, table: 'kostenstelleWerte' })
    fetchWerte({ db, store, table: 'mobileAboTypWerte' })
    fetchWerte({ db, store, table: 'kaderFunktionWerte' })
    fetchWerte({ db, store, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ db, store, table: 'etikettWerte' })
    fetchWerte({ db, store, table: 'landWerte' })
  }, [])

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
            <List activeId={activeId} activeTable={activeTable} {...datJson} />
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

export default observer(StammdatenContainer)
