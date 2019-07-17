import React, { useContext, useEffect } from 'react'
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
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const {
    showFilter,
    personen,
    setAbteilungen,
    setAemter,
    setAnwesenheitstage,
    setBereiche,
    setEtiketten,
    setFunktionen,
    setKaderFunktionen,
    setLinks,
    setMobileAbos,
    setPersonen,
    setSchluessel,
    setSektionen,
    setSettings,
    setTelefones,
    setWerte,
  } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const person = personen.find(p => p.id === activeId)
  // pass list the active person's props to enable instant updates
  const personJson = person ? person.toJSON() : {}
  const isPrinting = useDetectPrint()

  useEffect(() => {
    fetchPersonen({ db, setPersonen })
    fetchAemter({ db, setAemter })
    fetchAbteilungen({ db, setAbteilungen })
    fetchBereiche({ db, setBereiche })
    fetchSektionen({ db, setSektionen })
    fetchWerte({ db, setWerte, table: 'statusWerte' })
    fetchWerte({ db, setWerte, table: 'anredeWerte' })
    fetchWerte({ db, setWerte, table: 'funktionWerte' })
    fetchWerte({ db, setWerte, table: 'kaderFunktionWerte' })
    fetchEtiketten({ db, setEtiketten })
    fetchAnwesenheitstage({ db, setAnwesenheitstage })
    fetchWerte({ db, setWerte, table: 'etikettWerte' })
    fetchWerte({ db, setWerte, table: 'anwesenheitstagWerte' })
    fetchWerte({ db, setWerte, table: 'landWerte' })
    fetchWerte({ db, setWerte, table: 'mutationArtWerte' })
    fetchWerte({ db, setWerte, table: 'standortWerte' })
    fetchLinks({ db, setLinks })
    fetchSchluessel({ db, setSchluessel })
    fetchMobileAbos({ db, setMobileAbos })
    fetchTelefones({ db, setTelefones })
    fetchWerte({ db, setWerte, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ db, setWerte, table: 'mobileAboTypWerte' })
    fetchWerte({ db, setWerte, table: 'telefonTypWerte' })
    fetchWerte({ db, setWerte, table: 'schluesselTypWerte' })
    fetchWerte({ db, setWerte, table: 'schluesselAnlageWerte' })
    fetchFunktionen({ db, setFunktionen })
    fetchKaderFunktionen({ db, setKaderFunktionen })
    fetchSettings({ db, setSettings })
  }, [
    db,
    setAbteilungen,
    setAemter,
    setAnwesenheitstage,
    setBereiche,
    setEtiketten,
    setFunktionen,
    setKaderFunktionen,
    setLinks,
    setMobileAbos,
    setPersonen,
    setSchluessel,
    setSektionen,
    setSettings,
    setTelefones,
    setWerte,
  ])

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={isPrinting ? 0 : 0.25}
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
