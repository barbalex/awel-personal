// @flow
import React from 'react'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'

import ErrorBoundary from '../shared/ErrorBoundary'
import Person from './Person'
import List from './List'

const Container = styled.div`
  height: calc(100% - 56px);
`
// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// height: calc(100% - 56px);

const enhance = compose()

const PersonContainer = () => (
  <Container>
    <ErrorBoundary>
      <ReflexContainer orientation="vertical">
        <ReflexElement
          flex={0.33}
          propagateDimensions
          renderOnResizeRate={100}
          renderOnResize
        >
          <List />
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
