import React, { useContext } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTrashAlt } from 'react-icons/fa'
import { FaExclamationCircle } from 'react-icons/fa'

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
  line-height: 1.25em;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const Text = styled.div`
  max-width: calc(100% - 30px - 36px);
  max-width: ${props =>
    `calc(100% - 30px${props.nrOfSvgs ? ` - ${18 * props.nrOfSvgs}px` : ''})`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
`
const Svg = styled.div`
  margin: 0 3px;
  float: right;
`

const SektionList = ({ dimensions, activeId }) => {
  const store = useContext(storeContext)
  const { setLocation, showFilter, setShowFilter, showMutationNoetig } = store
  // eslint-disable-next-line no-restricted-globals
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  // eslint-disable-next-line no-restricted-globals
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  const sektionen = store.sektionenFiltered

  return (
    <Container>
      <List
        height={height}
        itemCount={sektionen.length}
        itemSize={50}
        width={width}
      >
        {({ index, style }) => {
          const row = sektionen[index]
          const showDelSvg = row.deleted === 1
          const showMutationNoetigSvg =
            row.mutationNoetig === 1 && showMutationNoetig
          const nrOfSvgs = row.deleted + (showMutationNoetigSvg ? 1 : 0)

          return (
            <Row
              style={style}
              onClick={() => {
                setLocation(['Sektionen', row.id.toString()])
                if (showFilter) setShowFilter(false)
              }}
              active={!showFilter && activeId === row.id}
              mutationNoetig={row.mutationNoetig}
            >
              <Text nrOfSvgs={nrOfSvgs}>{`${row.name || ''}`}</Text>
              {showDelSvg && (
                <Svg>
                  <FaTrashAlt id={`deletedIcon${row.id}`} />
                  <UncontrolledTooltip
                    placement="left"
                    target={`deletedIcon${row.id}`}
                  >
                    Diese Sektion wurde gelöscht
                  </UncontrolledTooltip>
                </Svg>
              )}
              {showMutationNoetigSvg && (
                <Svg>
                  <FaExclamationCircle id={`mutationNoetig${row.id}`} />
                  <UncontrolledTooltip
                    placement="left"
                    target={`mutationNoetig${row.id}`}
                  >
                    Handlungs-Bedarf
                  </UncontrolledTooltip>
                </Svg>
              )}
            </Row>
          )
        }}
      </List>
    </Container>
  )
}

export default observer(SektionList)
