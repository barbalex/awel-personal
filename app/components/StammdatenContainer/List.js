// @flow
import React, { Fragment } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'
import { UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'
import { FaTrashAlt } from 'react-icons/fa'

import tables from '../../src/tables'

const Container = styled.div`
  border-right: 1px solid rgb(46, 125, 50);
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
  observer
)

const DataList = ({
  dimensions,
  store,
  activeId,
  activeTable
}: {
  dimensions: Object,
  store: Object,
  activeId: ?number,
  activeTable: ?string
}) => {
  const { showDeleted, setLocation } = store
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  let data = store[activeTable].slice().filter(p => {
    if (!showDeleted) return p.deleted === 0
    return true
  })
  data = sortBy(data, 'sort')
  const table = tables.find(t => t.table === activeTable)

  return (
    <Container>
      <List height={height} itemCount={data.length} itemSize={50} width={width}>
        {({ index, style }) => {
          const row = data[index]

          return (
            <Row
              style={style}
              onClick={() => setLocation([activeTable, row.id.toString()])}
              active={activeId === row.id}
            >
              {row.value || '(kein Wert)'}
              {row.deleted === 1 && (
                <Fragment>
                  <FaTrashAlt id={`deletedIcon${row.id}`} />
                  <UncontrolledTooltip
                    placement="left"
                    target={`deletedIcon${row.id}`}
                  >
                    {`Dieser ${
                      table ? table.model : 'Datensatz'
                    } wurde gelöscht`}
                  </UncontrolledTooltip>
                </Fragment>
              )}
            </Row>
          )
        }}
      </List>
    </Container>
  )
}

export default enhance(DataList)
