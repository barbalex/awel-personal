// @flow
import React, { Component } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'
import sortBy from 'lodash/sortBy'

import fetchPersonen from '../../src/fetchPersonen'

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

/* const getEkfFromData = data => {
  const ekfAdresseId = get(data, 'ekfAdresseId')
  const ekfNodes = ekfAdresseId
    ? get(data, 'adresseById.tpopkontrsByBearbeiter.nodes', [])
    : get(
        data,
        'userByName.adresseByAdresseId.tpopkontrsByBearbeiter.nodes',
        []
      )
  const personen = ekfNodes.map(e => ({
    projekt: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.projektByProjId.name',
      ''
    ),
    projId: get(e, 'tpopByTpopId.popByPopId.apByApId.projektByProjId.id'),
    art: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
      ''
    ),
    apId: get(e, 'tpopByTpopId.popByPopId.apByApId.id'),
    pop: `${get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.popByPopId.name',
      '(kein Name)'
    )}`,
    popId: get(e, 'tpopByTpopId.popByPopId.id'),
    popSort: get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)'),
    tpop: `${get(e, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.flurname',
      '(kein Flurname)'
    )}`,
    tpopId: get(e, 'tpopByTpopId.id'),
    tpopSort: get(e, 'tpopByTpopId.nr', '(keine Nr)'),
    id: e.id
  }))
  return sortBy(personen, ['projekt', 'art', 'popSort', 'tpopSort'])
} */

const enhance = compose(
  inject('store'),
  observer
)

type Props = {
  dimensions: Object,
  store: Object
};

class PersonList extends Component<Props> {
  /* constructor(props) {
    super(props)
    this.state = { initialId: null }
  } */

  componentDidMount() {
    // fetch data and feed to store
    fetchPersonen()
  }

  componentDidUpdate(prevProps, prevState) {
    // set initial kontrId so form is shown for first person
    // IF none is choosen yet
    /* const personen = getEkfFromData(this.props.data)
    const activeNodeArray = get(this.props.data, 'tree.activeNodeArray')
    const activeId = activeNodeArray[9]
    if (
      personen &&
      personen.length &&
      personen.length > 0 &&
      !activeId &&
      !prevState.initialId
    ) {
      const row = personen[0]
      const url = [
        'Projekte',
        row.projId,
        'Aktionspläne',
        row.apId,
        'Populationen',
        row.popId,
        'Teil-Populationen',
        row.tpopId,
        'Freiwilligen-Kontrollen',
        row.id
      ]
      // TODO: initiateDataFromUrl(url)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ initialId: row.id })
    } */
  }

  render() {
    const { dimensions, store } = this.props
    let { personen } = store
    const { showDeleted, setLocation, location } = store
    const height = isNaN(dimensions.height) ? 250 : dimensions.height
    const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
    let activeId = location.toJSON()[1]
    if (!isNaN(activeId)) activeId = +activeId
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
                onClick={() => {
                  console.log('List, onClick, rowId:', row.id)
                  setLocation(['Personen', row.id.toString()])
                }}
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
}

export default enhance(PersonList)
