// @flow
import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'
import { FaTrashAlt } from 'react-icons/fa'

import tables from '../../../src/tables'
import storeContext from '../../../storeContext'

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

const StammdatenRow = ({
  index,
  style,
  activeId,
  activeTable,
}: {
  index: number,
  style: Object,
  activeId: ?number,
  activeTable: ?string,
}) => {
  const store = useContext(storeContext)
  const { showDeleted, setLocation } = store

  let data = store[activeTable].slice().filter(p => {
    if (!showDeleted) return p.deleted === 0
    return true
  })
  data = sortBy(data, ['sort', 'value'])
  const table = tables.find(t => t.table === activeTable)
  const row = data[index]

  const onClickRow = useCallback(
    () => setLocation([activeTable, row.id.toString()]),
    [activeTable, row.id],
  )

  return (
    <Row style={style} onClick={onClickRow} active={activeId === row.id}>
      {row.value || '(kein Wert)'}
      {row.deleted === 1 && (
        <>
          <FaTrashAlt id={`deletedIcon${row.id}`} />
          <UncontrolledTooltip placement="left" target={`deletedIcon${row.id}`}>
            {`Dieser ${table ? table.model : 'Datensatz'} wurde gelöscht`}
          </UncontrolledTooltip>
        </>
      )}
    </Row>
  )
}

export default observer(StammdatenRow)
