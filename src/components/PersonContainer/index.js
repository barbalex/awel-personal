import React, { useContext, useEffect, useRef } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import useDetectPrint from 'use-detect-print'

import ErrorBoundary from '../shared/ErrorBoundary'
import List from './List'
import PersonTab from './PersonTab'
import fetchPersonen from '../../src/fetchPersonen'
import fetchAemter from '../../src/fetchAemter'
import fetchAbteilungen from '../../src/fetchAbteilungen'
import fetchBereiche from '../../src/fetchBereiche'
import fetchSektionen from '../../src/fetchSektionen'
import fetchEtiketten from '../../src/fetchEtiketten'
import fetchAnwesenheitstage from '../../src/fetchAnwesenheitstage'
import fetchLinks from '../../src/fetchLinks'
import fetchSchluessel from '../../src/fetchSchluessel'
import fetchMobileAbos from '../../src/fetchMobileAbos'
import fetchTelefones from '../../src/fetchTelefones'
import fetchFunktionen from '../../src/fetchFunktionen'
import fetchKaderFunktionen from '../../src/fetchKaderFunktionen'
import fetchWerte from '../../src/fetchWerte'
import fetchSettings from '../../src/fetchSettings'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

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

const PersonContainer = () => {
  const store = useContext(storeContext)
  const { showFilter, personen, db } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const person = personen.find((p) => p.id === activeId)
  // pass list the active person's props to enable instant updates
  const personJson = person ? person.toJSON() : {}
  const isPrinting = useDetectPrint()

  const listRef = useRef(null)

  useEffect(() => {
    //console.log('PersonContainer useEffect, fetching data')
    fetchPersonen({ store })
    fetchAemter({ store })
    fetchAbteilungen({ store })
    fetchBereiche({ store })
    fetchSektionen({ store })
    fetchWerte({ store, table: 'statusWerte' })
    fetchWerte({ store, table: 'anredeWerte' })
    fetchWerte({ store, table: 'funktionWerte' })
    fetchWerte({ store, table: 'kaderFunktionWerte' })
    fetchEtiketten({ store })
    fetchAnwesenheitstage({ store })
    fetchWerte({ store, table: 'etikettWerte' })
    fetchWerte({ store, table: 'anwesenheitstagWerte' })
    fetchWerte({ store, table: 'landWerte' })
    fetchWerte({ store, table: 'mutationArtWerte' })
    fetchWerte({ store, table: 'standortWerte' })
    fetchLinks({ store })
    fetchSchluessel({ store })
    fetchMobileAbos({ store })
    fetchTelefones({ store })
    fetchWerte({ store, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ store, table: 'mobileAboTypWerte' })
    fetchWerte({ store, table: 'telefonTypWerte' })
    fetchWerte({ store, table: 'schluesselTypWerte' })
    fetchWerte({ store, table: 'schluesselAnlageWerte' })
    fetchFunktionen({ store })
    fetchKaderFunktionen({ store })
    fetchSettings({ store })
  }, [db, store])

  useEffect(() => {
    person?.fetch()
  }, [person])

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={isPrinting ? 0 : 0.25}
            propagateDimensions
            propagateDimensionsRate={100}
          >
            <List activeId={activeId} {...personJson} listRef={listRef} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement
            showfilter={showFilter}
            propagateDimensions
            propagateDimensionsRate={1000}
            resizeHeight={false}
          >
            <PersonTab listRef={listRef} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(PersonContainer)
