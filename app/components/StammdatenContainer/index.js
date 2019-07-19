import React, { useEffect, useContext, useRef } from 'react'
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
  const { setWerte } = store

  const location = store.location.toJSON()
  const activeTable = location[0]
  const activeId = ifIsNumericAsNumber(location[1])
  const data = store[activeTable]
  const dat = data.find(d => d.id === activeId)

  const db = useContext(dbContext)
  // pass list the active dat's props to enable instant updates
  const datJson = dat || {}

  useEffect(() => {
    fetchWerte({ db, setWerte, table: 'statusWerte' })
    fetchWerte({ db, setWerte, table: 'anredeWerte' })
    fetchWerte({ db, setWerte, table: 'kostenstelleWerte' })
    fetchWerte({ db, setWerte, table: 'mobileAboTypWerte' })
    fetchWerte({ db, setWerte, table: 'telefonTypWerte' })
    fetchWerte({ db, setWerte, table: 'schluesselTypWerte' })
    fetchWerte({ db, setWerte, table: 'schluesselAnlageWerte' })
    fetchWerte({ db, setWerte, table: 'funktionWerte' })
    fetchWerte({ db, setWerte, table: 'kaderFunktionWerte' })
    fetchWerte({ db, setWerte, table: 'mobileAboKostenstelleWerte' })
    fetchWerte({ db, setWerte, table: 'etikettWerte' })
    fetchWerte({ db, setWerte, table: 'anwesenheitstagWerte' })
    fetchWerte({ db, setWerte, table: 'landWerte' })
    fetchWerte({ db, setWerte, table: 'mutationArtWerte' })
    fetchWerte({ db, setWerte, table: 'standortWerte' })
  }, [db, setWerte])

  const listRef = useRef(null)

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
            <List
              activeId={activeId}
              activeTable={activeTable}
              {...datJson}
              listRef={listRef}
            />
          </ReflexElement>
          <ReflexSplitter />
          <StyledReflexElement>
            <Data
              activeId={activeId}
              activeTable={activeTable}
              listRef={listRef}
            />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(StammdatenContainer)
