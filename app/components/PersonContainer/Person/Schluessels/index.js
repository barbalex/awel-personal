// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button } from 'reactstrap'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'

const Container = styled.div`
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 20px;
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px;
  align-items: center;
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
  &:first-of-type {
    border-top: thin solid #cccccc;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const Name = styled.div`
  grid-column: 1 / span 1;
  grid-column: 1;
`
const Bemerkungen = styled.div`
  grid-column: 2 / span 1;
  grid-column: 2;
`
const Delete = styled.div`
  grid-column: 2 / span 1;
  margin-top: -2px;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
  color: #cccccc;
  font-size: 18px;
  cursor: pointer;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onNew: ({ store }) => () => store.addSchluessel()
  }),
  observer
)

const SchluesselComponent = ({
  store,
  onNew
}: {
  store: Object,
  onNew: () => void
}) => {
  const location = store.location.toJSON()
  if (!location[1]) throw new Error(`no id found`)
  const activePersonenId = ifIsNumericAsNumber(location[1])
  const schluessels = store.schluessel.filter(
    s => s.idPerson === activePersonenId
  )
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const mayAddNew =
    schluessels.length === 0 ||
    !schluessels.map(s => s.name).some(n => n === null)

  return (
    <FormGroup row>
      <Label for="schluessel" sm={2}>
        Schlüssel
      </Label>
      <Col sm={10}>
        <Container data-ispdf={isPdf} name="schluessel">
          {schluessels.map(schluessel => (
            <Row key={`${schluessel.id}`} data-ispdf={isPdf}>
              <Name>{schluessel.name}</Name>
              <Bemerkungen>{schluessel.bemerkungen}</Bemerkungen>
              <Delete
                data-ispdf={isPdf}
                onClick={() => store.deleteSchluessel(schluessel.id)}
                title="Schluessel entfernen"
                id={schluessel.id}
              >
                <i className="fas fa-times" />
              </Delete>
            </Row>
          ))}
          {mayAddNew && (
            <Button color="primary" onClick={onNew} outline>
              neu
            </Button>
          )}
        </Container>
      </Col>
    </FormGroup>
  )
}

export default enhance(SchluesselComponent)
