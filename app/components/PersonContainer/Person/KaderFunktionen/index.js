// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button } from 'reactstrap'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import KaderFunktion from './KaderFunktion'

const Container = styled.div`
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const StyledButton = styled(Button)`
  margin-top: 5px;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '1fr 1fr' : '1fr 1fr 20px'};
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`
const Funktion = styled.div`
  grid-column: 1 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 2 / span 1;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onNew: ({ store }) => () => store.addKaderFunktion()
  }),
  observer
)

const KaderFunktionComponent = ({
  store,
  onNew
}: {
  store: Object,
  onNew: () => void
}) => {
  const location = store.location.toJSON()
  if (!location[1]) throw new Error(`no id found`)
  const activePersonenId = ifIsNumericAsNumber(location[1])
  const kaderFunktionen = store.kaderFunktionen.filter(
    s => s.idPerson === activePersonenId
  )
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const mayAddNew =
    kaderFunktionen.length === 0 ||
    !kaderFunktionen.map(s => s.name).some(n => n === null)

  return (
    <FormGroup row>
      <Label for="kaderFunktion" sm={2}>
        Kaderfunktion
      </Label>
      <Col sm={10}>
        <Container data-ispdf={isPdf} name="kaderFunktion">
          {kaderFunktionen.length > 0 && (
            <Row data-ispdf={isPdf}>
              <Funktion>Funktion</Funktion>
              <Bemerkungen>Bemerkungen</Bemerkungen>
              {!isPdf && <div />}
            </Row>
          )}
          {kaderFunktionen.map(kaderFunktion => (
            <KaderFunktion key={kaderFunktion.id} id={kaderFunktion.id} />
          ))}
          {mayAddNew && (
            <StyledButton onClick={onNew} outline>
              neue Kaderfunktion
            </StyledButton>
          )}
        </Container>
      </Col>
    </FormGroup>
  )
}

export default enhance(KaderFunktionComponent)
