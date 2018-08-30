/* eslint-disable no-nested-ternary */
// @flow
import React, { Fragment } from 'react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { VariableSizeList as List } from 'react-window'
import sortBy from 'lodash/sortBy'
import moment from 'moment'
import { Button, UncontrolledTooltip } from 'reactstrap'
import ReactJson from 'react-json-view'

import ErrorBoundary from '../shared/ErrorBoundary'
import fetchMutations from '../../src/fetchMutations'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import Filter from './Filter'

moment.locale('de')

// height: calc(100% - ${document.getElementsByClassName('navbar')[0].clientHeight});
// above does not work
// seems that navbar is not finished when Mutations is built
const Container = styled.div`
  height: calc(100vh - 56px);
`
const Row = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${props => (props.active ? 'rgb(255, 250, 198)' : 'unset')};
  border-top: ${props =>
    props.active ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  padding: 15px 8px;
  display: grid;
  grid-template-columns: 150px 100px 100px 200px 100px 160px 1fr 1fr 50px;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
  overflow: hidden;
  overflow-x: auto;
`
const TitleRow = styled(Row)`
  font-weight: 700;
  padding: 8px;
  overflow: hidden;
  background-color: rgba(239, 239, 239, 1);
  > div > div {
    display: flex;
    flex-direction: column;
  }
`
const ListDiv = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 56px - 65px);
`
const Field = styled.div`
  padding: 0 10px;
  line-height: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`
const Time = styled(Field)``
const User = styled(Field)``
const Model = styled(Field)``
const Op = styled(Field)``
const Id = styled(Field)`
  text-align: end;
`
const FieldName = styled(Field)``
const Value = styled(Field)`
  overflow: auto;
`
const PreviousValue = styled(Field)`
  overflow: auto;
`
const RevertButton = styled(Button)`
  font-size: 0.8rem !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  margin-top: -5px;
  height: 27px;
  align-self: center;
`

const enhance = compose(
  inject('store'),
  withState('zeitFilter', 'setZeitFilter', null),
  withState('userFilter', 'setUserFilter', null),
  withState('opFilter', 'setOpFilter', null),
  withState('tableFilter', 'setTableFilter', null),
  withState('idFilter', 'setIdFilter', null),
  withState('fieldFilter', 'setFieldFilter', null),
  withState('valueFilter', 'setValueFilter', null),
  withState('previousValueFilter', 'setPreviousValueFilter', null),
  withHandlers({
    revert: ({ store }) => e => {
      const id = +e.target.dataset.id
      store.revertMutation(id)
    },
    onChangeZeitFilter: ({ setZeitFilter }) => e =>
      setZeitFilter(e.target.value),
    emptyZeitFilter: ({ setZeitFilter }) => () => setZeitFilter(null),
    onChangeUserFilter: ({ setUserFilter }) => e =>
      setUserFilter(e.target.value),
    emptyUserFilter: ({ setUserFilter }) => () => setUserFilter(null),
    onChangeOpFilter: ({ setOpFilter }) => e => setOpFilter(e.target.value),
    emptyOpFilter: ({ setOpFilter }) => () => setOpFilter(null),
    onChangeTableFilter: ({ setTableFilter }) => e =>
      setTableFilter(e.target.value),
    emptyTableFilter: ({ setTableFilter }) => () => setTableFilter(null),
    onChangeIdFilter: ({ setIdFilter }) => e => setIdFilter(e.target.value),
    emptyIdFilter: ({ setIdFilter }) => () => setIdFilter(null),
    onChangeFieldFilter: ({ setFieldFilter }) => e =>
      setFieldFilter(e.target.value),
    emptyFieldFilter: ({ setFieldFilter }) => () => setFieldFilter(null),
    onChangeValueFilter: ({ setValueFilter }) => e =>
      setValueFilter(e.target.value),
    emptyValueFilter: ({ setValueFilter }) => () => setValueFilter(null),
    onChangePreviousValueFilter: ({ setPreviousValueFilter }) => e =>
      setPreviousValueFilter(e.target.value),
    emptyPreviousValueFilter: ({ setPreviousValueFilter }) => () =>
      setPreviousValueFilter(null)
  }),
  withLifecycle({
    onDidMount() {
      fetchMutations()
    }
  }),
  observer
)

const getValueToShow = value => {
  let valueToShow = value
  if (!value && value !== 0) {
    valueToShow = ''
  } else if (!isNaN(value)) {
    // is a number
    if (value > 1530000000000 && moment.unix(value / 1000).isValid()) {
      // is a date
      valueToShow = moment.unix(value / 1000).format('YYYY.MM.DD H:mm:ss')
    } else {
      // is ab integer
      // prevent showing .0
      valueToShow = +value
    }
  } else if (value[0] === '{') {
    valueToShow = value
  }
  return valueToShow
}

const Mutations = ({
  store,
  revert,
  zeitFilter,
  onChangeZeitFilter,
  emptyZeitFilter,
  onChangeUserFilter,
  emptyUserFilter,
  onChangeOpFilter,
  emptyOpFilter,
  onChangeTableFilter,
  emptyTableFilter,
  onChangeIdFilter,
  emptyIdFilter,
  onChangeFieldFilter,
  emptyFieldFilter,
  onChangeValueFilter,
  emptyValueFilter,
  onChangePreviousValueFilter,
  emptyPreviousValueFilter,
  userFilter,
  opFilter,
  tableFilter,
  idFilter,
  fieldFilter,
  valueFilter,
  previousValueFilter
}: {
  store: Object,
  revert: () => void,
  zeitFilter?: ?string,
  onChangeZeitFilter: () => void,
  emptyZeitFilter: () => void,
  onChangeUserFilter: () => void,
  emptyUserFilter: () => void,
  onChangeOpFilter: () => void,
  emptyOpFilter: () => void,
  onChangeTableFilter: () => void,
  emptyTableFilter: () => void,
  onChangeIdFilter: () => void,
  emptyIdFilter: () => void,
  onChangeFieldFilter: () => void,
  emptyFieldFilter: () => void,
  onChangeValueFilter: () => void,
  emptyValueFilter: () => void,
  onChangePreviousValueFilter: () => void,
  emptyPreviousValueFilter: () => void,
  userFilter?: ?string,
  opFilter?: ?string,
  tableFilter?: ?string,
  idFilter?: ?string,
  fieldFilter?: ?string,
  valueFilter?: ?string,
  previousValueFilter?: ?string
}) => {
  const { setLocation, mutations: rawMutations } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const mutations = sortBy(rawMutations.slice(), 'id')
    .reverse()
    .map(m => {
      const {
        id,
        time,
        user,
        op,
        tableName,
        rowId,
        field,
        value,
        previousValue
      } = m
      return {
        id,
        time: moment.unix(time / 1000).format('YYYY.MM.DD HH:mm:ss'),
        user,
        op,
        tableName,
        rowId: op === 'add' ? JSON.parse(value).id : rowId,
        field,
        value: getValueToShow(value),
        previousValue: getValueToShow(previousValue)
      }
    })
    .filter(r => !zeitFilter || (r.time && r.time.includes(zeitFilter)))
    .filter(
      r =>
        !userFilter ||
        (r.user && r.user.toLowerCase().includes(userFilter.toLowerCase()))
    )
    .filter(
      r =>
        !opFilter ||
        (r.op && r.op.toLowerCase().includes(opFilter.toLowerCase()))
    )
    .filter(
      r =>
        !tableFilter ||
        (r.tableName &&
          r.tableName.toLowerCase().includes(tableFilter.toLowerCase()))
    )
    .filter(
      r => !idFilter || (r.rowId && r.rowId.toString().includes(idFilter))
    )
    .filter(
      r =>
        !fieldFilter ||
        (r.field && r.field.toLowerCase().includes(fieldFilter.toLowerCase()))
    )
    .filter(r => {
      if (!valueFilter) return true
      if (!r.value) return false
      if (!isNaN(r.value)) return r.value.toString().includes(valueFilter)
      return (
        r.value && r.value.toLowerCase().includes(valueFilter.toLowerCase())
      )
    })
    .filter(r => {
      if (!previousValueFilter) return true
      if (!r.previousValue) return false
      if (!isNaN(r.previousValue))
        return r.previousValue.toString().includes(previousValueFilter)
      return (
        r.previousValue &&
        r.previousValue
          .toLowerCase()
          .includes(previousValueFilter.toLowerCase())
      )
    })
  const rowHeights = mutations.map(m => {
    if (m.value && m.value[0] === '{') return 176
    if (m.previousValue && m.previousValue[0] === '{') return 176
    return 50
  })

  return (
    <ErrorBoundary>
      <Container>
        <TitleRow>
          <Time>
            <div>Zeit</div>
            <Filter
              value={zeitFilter}
              onChange={onChangeZeitFilter}
              empty={emptyZeitFilter}
            />
          </Time>
          <User>
            <div>Benutzer</div>
            <Filter
              value={userFilter}
              onChange={onChangeUserFilter}
              empty={emptyUserFilter}
            />
          </User>
          <Op>
            <div>Operation</div>
            <Filter
              value={opFilter}
              onChange={onChangeOpFilter}
              empty={emptyOpFilter}
            />
          </Op>
          <Model>
            <div>Tabelle</div>
            <Filter
              value={tableFilter}
              onChange={onChangeTableFilter}
              empty={emptyTableFilter}
            />
          </Model>
          <Id>
            <div>ID</div>
            <Filter
              value={idFilter}
              onChange={onChangeIdFilter}
              empty={emptyIdFilter}
            />
          </Id>
          <FieldName>
            <div>Feldname</div>
            <Filter
              value={fieldFilter}
              onChange={onChangeFieldFilter}
              empty={emptyFieldFilter}
            />
          </FieldName>
          <PreviousValue>
            <div>Alter Wert</div>
            <Filter
              value={previousValueFilter}
              onChange={onChangePreviousValueFilter}
              empty={emptyPreviousValueFilter}
            />
          </PreviousValue>
          <Value>
            <div>Neuer Wert</div>
            <Filter
              value={valueFilter}
              onChange={onChangeValueFilter}
              empty={emptyValueFilter}
            />
          </Value>
        </TitleRow>
        <ListDiv>
          <List
            height={window.innerHeight - 56}
            itemCount={mutations.length}
            itemSize={index => rowHeights[index] || 50}
            width={window.innerWidth}
          >
            {({ index, style }) => {
              const row = mutations[index]
              const {
                id,
                time,
                user,
                tableName,
                rowId,
                field,
                op,
                value,
                previousValue
              } = row

              return (
                <Row
                  style={style}
                  onClick={() => setLocation(['mutations', id.toString()])}
                  active={activeId === id}
                >
                  <Time>{time}</Time>
                  <User>{user}</User>
                  <Op>{op}</Op>
                  <Model>{tableName}</Model>
                  <Id>{rowId}</Id>
                  <FieldName>{field}</FieldName>
                  <PreviousValue>
                    {previousValue && previousValue[0] === '{' ? (
                      <ReactJson
                        src={JSON.parse(previousValue)}
                        name={null}
                        displayObjectSize={false}
                        displayDataTypes={false}
                      />
                    ) : (
                      previousValue
                    )}
                  </PreviousValue>
                  <Value>
                    {value && value[0] === '{' ? (
                      <ReactJson
                        src={JSON.parse(value)}
                        name={null}
                        displayObjectSize={false}
                        displayDataTypes={false}
                      />
                    ) : (
                      value
                    )}
                  </Value>
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
                    alten Wert wiederherstellen
                  </UncontrolledTooltip>
                </Row>
              )
            }}
          </List>
        </ListDiv>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Mutations)
