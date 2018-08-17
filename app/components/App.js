// @flow
import React from 'react'
import styled from 'styled-components'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`

const App = () => (
  <Container>
    <Navbar />
    <PersonContainer />
  </Container>
)

export default App
