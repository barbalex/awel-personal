// @flow
import React, { Fragment } from 'react'
import compose from 'recompose/compose'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { FixedSizeList as List } from 'react-window'
import { UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from './shared/ErrorBoundary'
import fetchMutations from '../src/fetchMutations'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when Mutations is built
const Container = styled.div`
  height: calc(100% - 56px);
`
const Row = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${props => (props.active ? 'rgb(255, 250, 198)' : 'unset')};
  border-top: ${props =>
    props.active ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  height: 50px;
  padding: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1em;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`

const enhance = compose(
  inject('store'),
  withLifecycle({
    onDidMount() {
      fetchMutations()
    }
  }),
  observer
)

const Mutations = ({ store }: { store: Object }) => {
  const { setLocation, mutations: rawMutations } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const mutations = sortBy(rawMutations.slice(), 'id')
  // const activeMutation = store.mutations.find(p => p.id === activeId)

  if (mutations.length === 0)
    return <Container>Es gibt noch keine Änderungen</Container>

  console.log('Mutations, mutations', mutations)

  return (
    <Container>
      <ErrorBoundary>
        <List
          height={300}
          itemCount={mutations.length}
          itemSize={50}
          width={window.innerWidth}
        >
          {({ index, style }) => {
            const row = mutations[index]
            console.log('row:', row)

            return (
              <Row
                style={style}
                onClick={() => setLocation(['mutations', row.id.toString()])}
                active={activeId === row.id}
              >
                {row.id}
              </Row>
            )
          }}
        </List>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(Mutations)
