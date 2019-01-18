// @flow
import React, { useContext, useEffect } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Person from './Person'
import List from './List'
import fetchPersonen from '../../src/fetchPersonen'
import fetchAbteilungen from '../../src/fetchAbteilungen'
import fetchSektionen from '../../src/fetchSektionen'
import fetchEtiketten from '../../src/fetchEtiketten'
import fetchLinks from '../../src/fetchLinks'
import fetchSchluessel from '../../src/fetchSchluessel'
import fetchMobileAbos from '../../src/fetchMobileAbos'
import fetchFunktionen from '../../src/fetchFunktionen'
import fetchWerte from '../../src/fetchWerte'
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
  overflow-x: hidden !important;
  > div {
    height: unset !important;
  }
`

const PersonContainer = () => {
  const store = useContext(storeContext)
  const db = useContext(dbContext)
  const { showFilter, personen } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const person = personen.find(p => p.id === activeId)
  // pass list the active person's props to enable instant updates
  const personJson = person ? person.toJSON() : {}

  useEffect(() => {
    fetchPersonen({ db, store })
    fetchAbteilungen({ db, store })
    fetchSektionen({ db, store })
    fetchWerte({ db, store, table: 'statusWerte' })
    fetchWerte({ db, store, table: 'anredeWerte' })
    // fetchWerte({ db, store, table: 'kostenstelleWerte' })
    fetchWerte({ db, store, table: 'funktionWerte' })
    fetchEtiketten({ db, store })
    fetchWerte({ db, store, table: 'etikettWerte' })
    fetchWerte({ db, store, table: 'landWerte' })
    fetchLinks({ db, store })
    fetchSchluessel({ db, store })
    fetchMobileAbos({ db, store })
    fetchWerte({ db, store, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ db, store, table: 'mobileAboTypWerte' })
    fetchWerte({ db, store, table: 'schluesselTypWerte' })
    fetchWerte({ db, store, table: 'schluesselAnlageWerte' })
    fetchFunktionen({ db, store })
    // set initial active id
    // nope, better not
    // for instance: after deleting do not show another user
    // generally: never sho a person the user has not choosen
    /*
      let { personen } = props.store
      personen = sortBy(personen, ['name', 'vorname'])
      const { showDeleted, location } = props.store
      if (!showDeleted) personen = personen.filter(p => p.deleted === 0)
      const activeId = location.toJSON()[1]
      if (personen && personen.length && personen.length > 0 && !activeId) {
        const row = personen[0]
        props.setInitialId(row.id)
      }
      */
  }, [])

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
            <List activeId={activeId} {...personJson} />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement showfilter={showFilter}>
            <Person activeId={activeId} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(PersonContainer)
