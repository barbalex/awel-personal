import React, { useContext, useEffect } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Amt from './Amt'
import List from './List'
import fetchAemter from '../../src/fetchAemter'
import fetchWerte from '../../src/fetchWerte'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'
import dbContext from '../../dbContext'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when AmtContainer is built
const Container = styled.div`
  height: calc(100vh - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${props =>
    props.showfilter ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow-x: hidden !important;
  > div {
    height: unset !important;
  }
`

const AmtContainer = () => {
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const { showFilter, aemter, setAemter } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const amt = aemter.find(p => p.id === activeId)
  // pass list the active amt's props to enable instant updates
  const amtJson = amt ? amt.toJSON() : {}

  useEffect(() => {
    fetchAemter({ db, setAemter })
    fetchWerte({ db, store, table: 'kostenstelleWerte' })
  }, [db, setAemter, store])

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={0.25}
            propagateDimensions
            renderOnResizeRate={100}
            renderOnResize
          >
            <List activeId={activeId} {...amtJson} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement showfilter={showFilter}>
            <Amt activeId={activeId} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(AmtContainer)
