import React, { useContext, useEffect } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
//import useDetectPrint from 'use-detect-print'
import last from 'lodash/last'
import useDetectPrint from 'use-detect-print'

import ErrorBoundary from '../shared/ErrorBoundary'
import PersonPrint from './PersonPrint'
import PersonMutationPrint from './PersonMutationPrint'
import List from './List'
import PersonTab from './PersonTab'
import fetchPersonen from '../../src/fetchPersonen'
import fetchAemter from '../../src/fetchAemter'
import fetchAbteilungen from '../../src/fetchAbteilungen'
import fetchBereiche from '../../src/fetchBereiche'
import fetchSektionen from '../../src/fetchSektionen'
import fetchEtiketten from '../../src/fetchEtiketten'
import fetchLinks from '../../src/fetchLinks'
import fetchSchluessel from '../../src/fetchSchluessel'
import fetchMobileAbos from '../../src/fetchMobileAbos'
import fetchTelefones from '../../src/fetchTelefones'
import fetchFunktionen from '../../src/fetchFunktionen'
import fetchWerte from '../../src/fetchWerte'
import fetchSettings from '../../src/fetchSettings'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'
import dbContext from '../../dbContext'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when PersonContainer is built
const Container = styled.div`
  height: calc(100vh - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  background-color: ${props =>
    props.showfilter ? '#f7f791' : 'rgba(0,0,0,0)'};
  overflow: hidden !important;
  > div {
    height: unset !important;
  }
`

const PersonContainer = () => {
  //const isPrinting = useDetectPrint()
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const { showFilter, personen, printing } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const person = personen.find(p => p.id === activeId)
  // pass list the active person's props to enable instant updates
  const personJson = person ? person.toJSON() : {}
  const isPrinting = useDetectPrint()

  useEffect(() => {
    fetchPersonen({ db, store })
    fetchAemter({ db, store })
    fetchAbteilungen({ db, store })
    fetchBereiche({ db, store })
    fetchSektionen({ db, store })
    fetchWerte({ db, store, table: 'statusWerte' })
    fetchWerte({ db, store, table: 'anredeWerte' })
    fetchWerte({ db, store, table: 'funktionWerte' })
    fetchEtiketten({ db, store })
    fetchWerte({ db, store, table: 'etikettWerte' })
    fetchWerte({ db, store, table: 'landWerte' })
    fetchWerte({ db, store, table: 'standortWerte' })
    fetchLinks({ db, store })
    fetchSchluessel({ db, store })
    fetchMobileAbos({ db, store })
    fetchTelefones({ db, store })
    fetchWerte({ db, store, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ db, store, table: 'mobileAboTypWerte' })
    fetchWerte({ db, store, table: 'telefonTypWerte' })
    fetchWerte({ db, store, table: 'schluesselTypWerte' })
    fetchWerte({ db, store, table: 'schluesselAnlageWerte' })
    fetchFunktionen({ db, store })
    fetchSettings({ db, store })
  }, [])

  const showPersonPrint = location.length === 3 && last(location) === 'pdf'
  const showPersonMutationPrint =
    location.length === 4 && last(location) === 'pdf'

  if (printing || isPrinting) {
    if (showPersonPrint) return <PersonPrint activeId={activeId} />
    if (showPersonMutationPrint)
      return <PersonMutationPrint activeId={activeId} />
  }

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={0.25}
            propagateDimensions
            propagateDimensionsRate={100}
          >
            <List activeId={activeId} {...personJson} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement
            showfilter={showFilter}
            propagateDimensions
            propagateDimensionsRate={1000}
            resizeHeight={false}
          >
            <PersonTab />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(PersonContainer)
