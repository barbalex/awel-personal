import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled, { createGlobalStyle } from 'styled-components'
import { observer } from 'mobx-react-lite'
import useDetectPrint from 'use-detect-print'
import { Outlet, useParams } from 'react-router-dom'

import ErrorBoundary from '../shared/ErrorBoundary'
import List from './List'
import storeContext from '../../storeContext'
import Navbar from '../Navbar'
import PersonPrint from './PersonPrint'
import PersonMutationPrint from './PersonMutationPrint'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when PersonContainer is built
const Container = styled.div`
  height: calc(100vh - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${(props) =>
    props.showfilter ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow: hidden !important;
  > div {
    height: unset !important;
  }
`
const A4Portrait = createGlobalStyle`
  @page {
    size: A4 portrait;
  }
`

const PersonContainer = () => {
  const { personId } = useParams()
  const store = useContext(storeContext)
  const { showFilter, personen, activePrintForm, printing } = store
  const person = personen.find((p) => p.id === personId)
  // pass list the active person's props to enable instant updates
  const personJson = person ? person.toJSON() : {}
  const isPrinting = useDetectPrint()

  const listRef = useRef(null)

  useEffect(() => {
    person?.fetch()
  }, [person])

  if ((printing || isPrinting) && personId) {
    if (activePrintForm === 'personalblatt') {
      return (
        <>
          <A4Portrait />
          <PersonPrint />
        </>
      )
    }
    if (activePrintForm === 'personMutation') {
      return (
        <>
          <A4Portrait />
          <PersonMutationPrint />
        </>
      )
    }
  }

  return (
    <>
      <Navbar />
      <Container>
        <ErrorBoundary>
          <ReflexContainer orientation="vertical">
            <ReflexElement
              flex={isPrinting ? 0 : 0.25}
              propagateDimensions
              propagateDimensionsRate={100}
            >
              <List activeId={personId} {...personJson} listRef={listRef} />
            </ReflexElement>
            <ReflexSplitter />
            <StyledReflexElement
              showfilter={showFilter}
              propagateDimensions
              propagateDimensionsRate={1000}
              resizeHeight={false}
            >
              <Outlet listRef={listRef} />
            </StyledReflexElement>
          </ReflexContainer>
        </ErrorBoundary>
      </Container>
    </>
  )
}

export default observer(PersonContainer)
