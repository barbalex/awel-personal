// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Col, Form, FormGroup, Label, Input } from 'reactstrap'

const Container = styled.div`
  margin: 20px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onBlur: ({ store }) => e => {
      const location = store.location.toJSON()
      let activeId = location[1]
      if (!isNaN(activeId)) activeId = +activeId
      const { personen } = store
      const person = personen.find(p => p.id === activeId) || {}

      person.setField({
        field: e.target.name,
        value: e.target.value,
        id: person.id
      })
    }
  }),
  observer
)

const Person = ({ store, onBlur }: { store: Object, onBlur: () => void }) => {
  const location = store.location.toJSON()
  let activeId = location[1]
  if (!isNaN(activeId)) activeId = +activeId
  const { personen } = store
  const person = personen.find(p => p.id === activeId) || {}

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
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="vorname" sm={2}>
            Vorname
          </Label>
          <Col sm={10}>
            <Input
              name="vorname"
              id="vorname"
              defaultValue={person.vorname || ''}
              onBlur={onBlur}
            />
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
              defaultValue={person.kurzzeichen || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
      </Form>
    </Container>
  )
}

export default enhance(Person)
