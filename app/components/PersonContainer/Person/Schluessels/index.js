// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button } from 'reactstrap'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import Schluessel from './Schluessel'

const Container = styled.div`
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
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
            <Schluessel key={schluessel.id} id={schluessel.id} />
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
