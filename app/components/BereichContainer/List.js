import React, { useContext } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTrashAlt } from 'react-icons/fa'

import storeContext from '../../storeContext'

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

const BereichList = ({ dimensions, activeId }) => {
  const store = useContext(storeContext)
  const { setLocation, showFilter, setShowFilter } = store
  // eslint-disable-next-line no-restricted-globals
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  // eslint-disable-next-line no-restricted-globals
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  const bereiche = store.bereicheFiltered

  return (
    <Container>
      <List
        height={height}
        itemCount={bereiche.length}
        itemSize={50}
        width={width}
      >
        {({ index, style }) => {
          const row = bereiche[index]

          return (
            <Row
              style={style}
              onClick={() => {
                setLocation(['Bereiche', row.id.toString()])
                if (showFilter) setShowFilter(false)
              }}
              active={!showFilter && activeId === row.id}
            >
              <div>{`${row.name || ''}`}</div>
              {row.deleted === 1 && (
                <>
                  <FaTrashAlt id={`deletedIcon${row.id}`} />
                  <UncontrolledTooltip
                    placement="left"
                    target={`deletedIcon${row.id}`}
                  >
                    Dieser Bereich wurde gelöscht
                  </UncontrolledTooltip>
                </>
              )}
            </Row>
          )
        }}
      </List>
    </Container>
  )
}

export default observer(BereichList)
