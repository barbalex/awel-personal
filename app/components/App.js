// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'
import StammdatenContainer from './StammdatenContainer'
import DeletionModal from './DeletionModal'
import Mutations from './Mutations'
import storeContext from '../storeContext'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`

const App = () => {
  const store = useContext(storeContext)
  const activeLocation = store.location.toJSON()[0]

  return (
    <Container>
      <Navbar />
      {activeLocation === 'Personen' && <PersonContainer />}
      {activeLocation.includes('Werte') && <StammdatenContainer />}
      {activeLocation === 'mutations' && <Mutations />}
      <DeletionModal />
    </Container>
  )
}

export default observer(App)
