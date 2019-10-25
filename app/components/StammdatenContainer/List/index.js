import React, { useContext } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import sortBy from 'lodash/sortBy'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../../storeContext'
import Row from './Row'

const Container = styled.div`
  border-right: 1px solid rgb(46, 125, 50);
`

const DataList = ({ dimensions, activeId, activeTable, listRef }) => {
  const store = useContext(storeContext)
  const { showDeleted } = store

  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  let data = store[activeTable].slice().filter(p => {
    if (!showDeleted) return p.deleted === 0
    return true
  })
  data = sortBy(data, ['sort', 'value'])

  return (
    <ErrorBoundary>
      <Container>
        <List
          height={height}
          itemCount={data.length}
          itemSize={50}
          width={width}
          ref={listRef}
        >
          {({ index, style }) => (
            <Row
              style={style}
              activeId={activeId}
              index={index}
              activeTable={activeTable}
            />
          )}
        </List>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(DataList)
