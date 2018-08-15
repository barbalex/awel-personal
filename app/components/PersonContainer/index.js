// @flow
import React from 'react'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import Person from './Person'

const Container = styled.div`
  height: 100%;
`

const enhance = compose()

const PersonContainer = () => (
  <Container>
    <ErrorBoundary>
      <ReflexContainer orientation="vertical">
        <ReflexElement flex={0.33}>
          <div>liste</div>
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement
          propagateDimensions
          renderOnResizeRate={100}
          renderOnResize
        >
          <Person />
        </ReflexElement>
      </ReflexContainer>
    </ErrorBoundary>
  </Container>
)

export default enhance(PersonContainer)
