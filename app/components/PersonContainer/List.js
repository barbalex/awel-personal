// @flow
import React from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'
import sortBy from 'lodash/sortBy'

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

const PersonList = ({
  dimensions,
  store,
  activeId
}: {
  dimensions: Object,
  store: Object,
  activeId: ?number
}) => {
  const { showDeleted, setLocation } = store
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  let { personen } = store
  personen = sortBy(personen, ['name', 'vorname'])
  if (!showDeleted) personen = personen.filter(p => p.deleted === 0)

  return (
    <Container>
      <List
        height={height}
        itemCount={personen.length}
        itemSize={50}
        width={width}
      >
        {({ index, style }) => {
          const row = personen[index]

          return (
            <Row
              style={style}
              onClick={() => setLocation(['Personen', row.id.toString()])}
              active={activeId === row.id}
            >
              {`${row.name} ${row.vorname}`}
            </Row>
          )
        }}
      </List>
    </Container>
  )
}

export default enhance(PersonList)
