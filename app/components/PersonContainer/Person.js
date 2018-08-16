// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap'

const Container = styled.div`
  padding: 10px;
`

const enhance = compose(
  inject('store'),
  observer
)

const Person = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  let activeId = location[1]
  if (!isNaN(activeId)) activeId = +activeId
  const { personen } = store
  const person = personen.find(p => p.id === activeId)
  console.log('Person:', { location, person })

  return (
    <Container>
      <Form>
        <FormGroup row>
          <Label for="name" sm={2}>
            Name
          </Label>
          <Col sm={10}>
            <Input name="name" id="name" value={person ? person.name : ''} />
          </Col>
        </FormGroup>
      </Form>
    </Container>
  )
}

export default enhance(Person)
