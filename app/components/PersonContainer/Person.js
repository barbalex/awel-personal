// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'
import { Col, Form, FormGroup, Label, Input } from 'reactstrap'

const Container = styled.div`
  margin: 20px;
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
  const person = personen.find(p => p.id === activeId) || {}
  console.log('Person, person:', person)

  return (
    <Container>
      <Form>
        <FormGroup row>
          <Label for="name" sm={2}>
            Name
          </Label>
          <Col sm={10}>
            <Input
              name="name"
              id="name"
              defaultValue={person.name || ''}
              onBlur={e => {
                // TODO
                person.setField({
                  field: 'name',
                  value: e.target.value,
                  id: person.id
                })
              }}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="vorname" sm={2}>
            Vorname
          </Label>
          <Col sm={10}>
            <Input name="vorname" id="vorname" value={person.vorname || ''} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="kurzzeichen" sm={2}>
            Kurzzeichen
          </Label>
          <Col sm={10}>
            <Input
              name="kurzzeichen"
              id="kurzzeichen"
              value={person.kurzzeichen || ''}
            />
          </Col>
        </FormGroup>
      </Form>
    </Container>
  )
}

export default enhance(Person)
