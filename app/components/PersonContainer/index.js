// @flow
import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../shared/ErrorBoundary'
import Person from './Person'
import List from './List'
import fetchPersonen from '../../src/fetchPersonen'

const Container = styled.div`
  height: calc(100% - 56px);
`
// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when PersonContainer is built

const enhance = compose(
  inject('store'),
  withState('initialId', 'setInitialId', null),
  withLifecycle({
    onDidMount(props) {
      fetchPersonen()
      // set initial active id
      let { personen } = props.store
      personen = sortBy(personen, ['name', 'vorname'])
      const { showDeleted, location } = props.store
      if (!showDeleted) personen = personen.filter(p => p.deleted === 0)
      const activeId = location.toJSON()[1]
      if (personen && personen.length && personen.length > 0 && !activeId) {
        const row = personen[0]
        props.setInitialId(row.id)
      }
    }
  }),
  observer
)

const PersonContainer = ({
  store,
  initialId
}: {
  store: Object,
  initialId: ?number
}) => {
  const location = store.location.toJSON()
  let activeId = initialId
  if (location[1]) activeId = location[1]
  if (!isNaN(activeId)) activeId = +activeId

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
            <List activeId={activeId} />
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement>
            <Person activeId={activeId} />
          </ReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(PersonContainer)
