// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'
import StammdatenContainer from './StammdatenContainer'
import DeletionModal from './DeletionModal'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`

const enhance = compose(
  inject('store'),
  observer
)

const App = ({ store }: { store: Object }) => {
  const activeLocation = store.location.toJSON()[0]
  return (
    <Container>
      <Navbar />
      {activeLocation === 'Personen' && <PersonContainer />}
      {activeLocation.includes('Werte') && <StammdatenContainer />}
      <DeletionModal />
    </Container>
  )
}

export default enhance(App)
