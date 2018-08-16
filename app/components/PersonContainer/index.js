// @flow
import React from 'react'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import ErrorBoundary from '../shared/ErrorBoundary'
import Person from './Person'
import List from './List'

const Container = styled.div`
  height: calc(100% - 56px);
`
// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when PersonContainer is built

const enhance = compose(
  inject('store'),
  observer
)

const PersonContainer = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  const activeId = location[1]

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
            <List />
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement
            propagateDimensions
            renderOnResizeRate={100}
            renderOnResize
          >
            {activeId && <Person />}
          </ReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(PersonContainer)
