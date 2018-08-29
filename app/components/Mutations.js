/* eslint-disable no-nested-ternary */
// @flow
import React from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { splitJsonPath } from 'mobx-state-tree'
import { FixedSizeList as List } from 'react-window'
import sortBy from 'lodash/sortBy'
import moment from 'moment'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip
} from 'reactstrap'

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
  padding: 15px 8px;
  white-space: nowrap;
  overflow: auto;
  text-overflow: ellipsis;
  line-height: 1em;
  display: grid;
  grid-template-columns: 170px 90px 100px 230px 90px 190px 1fr 50px;
  justify-content: flex-start;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const TitleRow = styled(Row)`
  font-weight: 700;
  padding: 8px;
  height: 33px;
  overflow: hidden;
  background-color: rgba(239, 239, 239, 1);
`
const Field = styled.div`
  padding: 0 10px;
`
const Time = styled(Field)``
const User = styled(Field)``
const Model = styled(Field)``
const Op = styled(Field)``
const Id = styled(Field)`
  text-align: end;
`
const FieldName = styled(Field)``
const Value = styled(Field)``
const RevertButton = styled(Button)`
  font-size: 0.8rem !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  margin-top: -5px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    revert: ({ store }) => e => {
      const id = +e.target.dataset.id
      const { mutations } = store
      const mutation = mutations.find(m => m.id === id)
      if (!mutation) throw new Error(`Keine Mutation mit id ${id} gefunden`)
      console.log('TODO:', { id, mutation })
    }
  }),
  withLifecycle({
    onDidMount() {
      fetchMutations()
    }
  }),
  observer
)

const Mutations = ({
  store,
  revert
}: {
  store: Object,
  revert: () => void
}) => {
  const { setLocation, mutations: rawMutations } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const mutations = sortBy(rawMutations.slice(), 'id')
    .reverse()
    .map(m => {
      const { id, time, user, model, op, path, value } = m
      const [rowId, field] = splitJsonPath(path)
      const rowIdToShow = op === 'add' ? JSON.parse(value).id : rowId
      let valueToShow = value
      if (!value && value !== 0) {
        valueToShow = null
      } else if (!isNaN(value)) {
        // is a number
        if (value > 1530000000000 && moment.unix(value / 1000).isValid()) {
          // is a date
          valueToShow = moment.unix(time / 1000).format('YYYY.MM.DD H:mm:ss')
        } else {
          // is ab integer
          // prevent showing .0
          valueToShow = +value
        }
      } else if (value[0] === '{') {
        valueToShow = null
      }
      return {
        id,
        time: moment.unix(time / 1000).format('YYYY.MM.DD HH:mm:ss'),
        user,
        op,
        model,
        rowId: rowIdToShow,
        field,
        value: valueToShow
      }
    })

  if (mutations.length === 0) {
    return <NoDataContainer>Es gibt noch keine Änderungen</NoDataContainer>
  }

  return (
    <ErrorBoundary>
      <Container>
        <TitleRow>
          <Time>Zeit</Time>
          <User>Benutzer</User>
          <Op>Operation</Op>
          <Model>Tabelle</Model>
          <Id>ID</Id>
          <FieldName>Feldname</FieldName>
          <Value>Wert</Value>
        </TitleRow>
        <List
          height={window.innerHeight - 56}
          itemCount={mutations.length}
          itemSize={50}
          width={window.innerWidth}
        >
          {({ index, style }) => {
            const row = mutations[index]
            const { id, time, user, model, rowId, field, op, value } = row

            return (
              <Row
                style={style}
                onClick={() => setLocation(['mutations', id.toString()])}
                active={activeId === id}
              >
                <Time>{time}</Time>
                <User>{user}</User>
                <Op>{op}</Op>
                <Model>{model}</Model>
                <Id>{rowId}</Id>
                <FieldName>{field}</FieldName>
                <Value>{value || ''}</Value>
                <RevertButton
                  id={`revertButton${id}`}
                  data-id={id}
                  onClick={revert}
                  outline
                >
                  <i className="fas fa-undo" data-id={id} />
                </RevertButton>
                <UncontrolledTooltip
                  placement="left"
                  target={`revertButton${id}`}
                >
                  wiederherstellen
                </UncontrolledTooltip>
              </Row>
            )
          }}
        </List>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Mutations)
