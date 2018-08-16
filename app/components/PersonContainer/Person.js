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
        <FormGroup row>
          <Label for="telefonNr" sm={2}>
            Telefon
          </Label>
          <Col sm={10}>
            <Input
              name="telefonNr"
              id="telefonNr"
              defaultValue={person.telefonNr || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="telefonNrMobile" sm={2}>
            Telefon mobile
          </Label>
          <Col sm={10}>
            <Input
              name="telefonNrMobile"
              id="telefonNrMobile"
              defaultValue={person.telefonNrMobile || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="email" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="email"
              defaultValue={person.email || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="geburtDatum" sm={2}>
            Geburtsdatum
          </Label>
          <Col sm={10}>
            <Input
              name="geburtDatum"
              id="geburtDatum"
              defaultValue={person.geburtDatum || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="bueroNr" sm={2}>
            Büro Nr.
          </Label>
          <Col sm={10}>
            <Input
              name="bueroNr"
              id="bueroNr"
              defaultValue={person.bueroNr || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="abteilung" sm={2}>
            Abteilung
          </Label>
          <Col sm={10}>
            <Input
              name="abteilung"
              id="abteilung"
              defaultValue={person.abteilung || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="kostenstelle" sm={2}>
            Kostenstelle
          </Label>
          <Col sm={10}>
            <Input
              name="kostenstelle"
              id="kostenstelle"
              defaultValue={person.kostenstelle || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="vorgesetzt" sm={2}>
            {'Vorgesetzte(r)'}
          </Label>
          <Col sm={10}>
            <Input
              name="vorgesetzt"
              id="vorgesetzt"
              defaultValue={person.vorgesetzt || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="eintrittDatum" sm={2}>
            Eintritt Datum
          </Label>
          <Col sm={10}>
            <Input
              name="eintrittDatum"
              id="eintrittDatum"
              defaultValue={person.eintrittDatum || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="austrittDatum" sm={2}>
            Austritt Datum
          </Label>
          <Col sm={10}>
            <Input
              name="austrittDatum"
              id="austrittDatum"
              defaultValue={person.austrittDatum || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="status" sm={2}>
            Status
          </Label>
          <Col sm={10}>
            <Input
              name="status"
              id="status"
              defaultValue={person.status || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="parkplatzNr" sm={2}>
            Parkplatz Nr.
          </Label>
          <Col sm={10}>
            <Input
              name="parkplatzNr"
              id="parkplatzNr"
              defaultValue={person.parkplatzNr || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="parkplatzBeitrag" sm={2}>
            Parkplatz Beitrag
          </Label>
          <Col sm={10}>
            <Input
              name="parkplatzBeitrag"
              id="parkplatzBeitrag"
              defaultValue={person.parkplatzBeitrag || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="geschlecht" sm={2}>
            Geschlecht
          </Label>
          <Col sm={10}>
            <Input
              name="geschlecht"
              id="geschlecht"
              defaultValue={person.geschlecht || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="bemerkungen" sm={2}>
            Bemerkungen
          </Label>
          <Col sm={10}>
            <Input
              type="textarea"
              name="bemerkungen"
              id="bemerkungen"
              defaultValue={person.bemerkungen || ''}
              onBlur={onBlur}
            />
          </Col>
        </FormGroup>
      </Form>
    </Container>
  )
}

export default enhance(Person)
