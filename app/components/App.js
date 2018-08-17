// @flow
import React from 'react'
import styled from 'styled-components'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'
import DeletionModal from './DeletionModal'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`

const App = () => (
  <Container>
    <Navbar />
    <PersonContainer />
    <DeletionModal />
  </Container>
)

export default App
