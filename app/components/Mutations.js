/* eslint-disable no-nested-ternary */
// @flow
import React from 'react'
import compose from 'recompose/compose'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { FixedSizeList as List } from 'react-window'
import sortBy from 'lodash/sortBy'
import ReactJson from 'react-json-view'
import moment from 'moment'

import ErrorBoundary from './shared/ErrorBoundary'
import fetchMutations from '../src/fetchMutations'
import ifIsNumericAsNumber from '../src/ifIsNumericAsNumber'

moment.locale('de')

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when Mutations is built
const Container = styled.div`
  height: calc(100% - 56px);
`
const NoDataContainer = styled.div`
  height: calc(100% - 56px);
  padding: 15px;
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
  overflow: auto;
  text-overflow: ellipsis;
  line-height: 1em;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const Id = styled.div`
  width: 60px;
`
const Time = styled.div`
  width: 160px;
`
const User = styled.div`
  width: 90px;
`
const Model = styled.div`
  width: 100px;
`
const Op = styled.div`
  width: 100px;
`
const Path = styled.div`
  width: 190px;
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
  const mutations = sortBy(rawMutations.slice(), 'id').reverse()
  // const activeMutation = store.mutations.find(p => p.id === activeId)

  if (mutations.length === 0) {
    return <NoDataContainer>Es gibt noch keine Änderungen</NoDataContainer>
  }

  return (
    <ErrorBoundary>
      <Container>
        <List
          height={window.innerHeight - 56}
          itemCount={mutations.length}
          itemSize={100}
          width={window.innerWidth}
        >
          {({ index, style }) => {
            const row = mutations[index]
            const { id, time, user, model, op, path, value } = row

            return (
              <Row
                style={style}
                onClick={() => setLocation(['mutations', id.toString()])}
                active={activeId === id}
              >
                <Id>{id}</Id>
                <Time>
                  {moment.unix(time / 1000).format('DD.MM.YYYY H:mm:ss')}
                </Time>
                <User>{user}</User>
                <Model>{model}</Model>
                <Op>{op}</Op>
                <Path>{path}</Path>
                {value[0] === '{' ? (
                  <ReactJson src={JSON.parse(value)} />
                ) : moment.unix(value / 1000).isValid() &&
                value > 1530000000000 ? (
                  <div>
                    {moment.unix(time / 1000).format('DD.MM.YYYY H:mm:ss')}
                  </div>
                ) : (
                  <div>{value || ''}</div>
                )}
              </Row>
            )
          }}
        </List>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Mutations)
