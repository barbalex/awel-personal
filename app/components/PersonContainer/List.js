// @flow
import React, { Component } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject } from 'mobx-react'

import fetchPersonen from '../../src/fetchPersonen'

const Container = styled.div`
  height: 100%;
  border-right: 1px solid rgb(46, 125, 50);
`
const OuterContainer = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${props => (props.active ? 'rgb(255, 250, 198)' : 'unset')};
  border-top: ${props =>
    props.active ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const InnerContainer = styled.div`
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const enhance = compose(inject('store'))

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
    const { personen } = store
    const height = isNaN(dimensions.height) ? 250 : dimensions.height
    const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
    // const activeNodeArray = get(data, 'tree.activeNodeArray')
    // const activeId = activeNodeArray[9]

    return (
      <Container>
        <List
          height={height}
          itemCount={personen.length}
          itemSize={91}
          width={width}
        >
          {({ index, style }) => {
            const row = personen[index]
            // const url = ['Personen', row.id]

            return (
              <OuterContainer
                style={style}
                onClick={() => console.log('TODO')}
                // active={activeId === row.id}
              >
                <InnerContainer>
                  <div>{row.name}</div>
                  <div>{row.vorname}</div>
                  <div>{row.kurzzeichen}</div>
                </InnerContainer>
              </OuterContainer>
            )
          }}
        </List>
      </Container>
    )
  }
}

export default enhance(PersonList)
