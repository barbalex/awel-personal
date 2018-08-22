// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'

import Input from '../shared/Input'
import SharedCheckbox from '../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import isDateField from '../../src/isDateField'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    saveToDb: ({ store, activeTable }) => ({ field, value }) => {
      const location = store.location.toJSON()
      const activeId = ifIsNumericAsNumber(location[1])
      const { personen } = store
      const person = personen.find(p => p.id === activeId)
      if (!person) throw new Error(`Person with id ${activeId} not found`)
      let newValue
      if (isDateField(field)) {
        if (value) newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        if (newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      store.updateField({
        table: 'personen',
        parentModel: 'personen',
        field,
        value: newValue,
        id: person.id
      })
    },
    addEtikett: ({ store }) => etikett => store.addEtikett(etikett),
    deleteEtikett: ({ store }) => etikett => store.deleteEtikett(etikett)
  }),
  observer
)

const Data = ({
  store,
  activeId,
  activeTable,
  saveToDb
}: {
  store: Object,
  activeId: ?number,
  activeTable: ?string,
  saveToDb: () => void
}) => {
  if (!activeId) return null

  const {
    showDeleted,
    abteilungWerte,
    kostenstelleWerte,
    statusWerte,
    geschlechtWerte,
    etikettWerte
  } = store
  const dat = store[activeTable].find(p => p.id === activeId) || {}

  return (
    <Container>
      <StyledForm>
        <Input
          key={`${dat.id}id`}
          value={dat.id}
          field="id"
          label="id"
          saveToDb={saveToDb}
          disabled
        />
        <Input
          key={`${dat.id}value`}
          value={dat.value}
          field="value"
          label="Wert"
          saveToDb={saveToDb}
        />
        {showDeleted && (
          <SharedCheckbox
            key={`${dat.id}deleted`}
            value={dat.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
          />
        )}
        <SharedCheckbox
          key={`${dat.id}historic`}
          value={dat.historic}
          field="historic"
          label="historisch"
          saveToDb={saveToDb}
        />
        <Input
          key={`${dat.id}sort`}
          value={dat.sort}
          field="sort"
          label="Sortierung"
          type="number"
          saveToDb={saveToDb}
        />
      </StyledForm>
    </Container>
  )
}

export default enhance(Data)
