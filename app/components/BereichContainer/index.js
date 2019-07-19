import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Bereich from './Bereich'
import List from './List'
import fetchPersonen from '../../src/fetchPersonen'
import fetchBereiche from '../../src/fetchBereiche'
import fetchAbteilungen from '../../src/fetchAbteilungen'
import fetchWerte from '../../src/fetchWerte'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'
import dbContext from '../../dbContext'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when BereichContainer is built
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

const BereichContainer = () => {
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const {
    showFilter,
    bereiche,
    setBereiche,
    setAbteilungen,
    setPersonen,
    setWerte,
  } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const bereich = bereiche.find(p => p.id === activeId)
  // pass list the active bereich's props to enable instant updates
  const bereichJson = bereich ? bereich.toJSON() : {}

  useEffect(() => {
    fetchBereiche({ db, setBereiche })
    fetchAbteilungen({ db, setAbteilungen })
    fetchPersonen({ db, setPersonen })
    fetchWerte({ db, setWerte, table: 'kostenstelleWerte' })
  }, [db, setAbteilungen, setBereiche, setPersonen, setWerte])

  const listRef = useRef(null)

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
            <List activeId={activeId} {...bereichJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement showfilter={showFilter}>
            <Bereich activeId={activeId} listRef={listRef} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(BereichContainer)
