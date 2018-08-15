// @flow
import React from 'react'
import styled from 'styled-components'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const App = () => (
  <Container>
    <Navbar />
    <PersonContainer />
  </Container>
)

export default App
