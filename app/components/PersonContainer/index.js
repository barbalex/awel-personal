// @flow
import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import ErrorBoundary from '../shared/ErrorBoundary'
import Person from './Person'
import List from './List'
import fetchPersonen from '../../src/fetchPersonen'
import fetchWerte from '../../src/fetchWerte'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when PersonContainer is built
const Container = styled.div`
  height: calc(100% - 56px);
`
// seems needed to prevent unnessecary scrollbars
const StyledReflexElement = styled(ReflexElement)`
  > div {
    height: unset !important;
  }
`

const enhance = compose(
  inject('store'),
  withState('initialId', 'setInitialId', null),
  withLifecycle({
    onDidMount() {
      fetchPersonen()
      fetchWerte('statusWerte')
      fetchWerte('geschlechtWerte')
      fetchWerte('abteilungWerte')
      fetchWerte('kostenstelleWerte')
      fetchWerte('mobileAboTypWerte')
      fetchWerte('kaderFunktionWerte')
      fetchWerte('mobileAboKostenstelleWerte')
      fetchWerte('tagWerte')
      // set initial active id
      // nope, better not
      // for instance: after deleting do not show another user
      // generally: never sho a person the user has not choosen
      /*
      let { personen } = props.store
      personen = sortBy(personen, ['name', 'vorname'])
      const { showDeleted, location } = props.store
      if (!showDeleted) personen = personen.filter(p => p.deleted === 0)
      const activeId = location.toJSON()[1]
      if (personen && personen.length && personen.length > 0 && !activeId) {
        const row = personen[0]
        props.setInitialId(row.id)
      }
      */
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
  const { statusWerte, geschlechtWerte } = store
  const location = store.location.toJSON()
  let activeId = initialId
  if (location[1]) activeId = location[1]
  if (!isNaN(activeId)) activeId = +activeId
  console.log('PersonContainer', { statusWerte, geschlechtWerte })

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
          <StyledReflexElement>
            <Person activeId={activeId} />
          </StyledReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(PersonContainer)
