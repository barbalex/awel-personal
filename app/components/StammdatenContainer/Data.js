// @flow
/* eslint no-unused-vars:0 */
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
import tables from '../../src/tables'

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
      const {
        showDeleted,
        abteilungWerte,
        kostenstelleWerte,
        statusWerte,
        geschlechtWerte,
        etikettWerte,
        mobileAboTypWerte,
        mobileAboKostenstelleWerte,
        kaderFunktionWerte
      } = store
      const data = store[activeTable]
      const dat = data.find(d => d.id === activeId)
      if (!dat)
        throw new Error(
          `keinen Datensatz in Tabelle "${activeTable}" mit id "${activeId}" gefunden.`
        )

      const newValue = ifIsNumericAsNumber(value)
      const parentModel = tables.find(t => t.table === activeTable).parentModel

      store.updateField({
        table: activeTable,
        parentModel,
        field,
        value: newValue,
        id: dat.id
      })
    }
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
    etikettWerte,
    mobileAboTypWerte,
    mobileAboKostenstelleWerte,
    kaderFunktionWerte
  } = store
  const dat = store[activeTable].find(p => p.id === activeId)
  if (!dat)
    return (
      <Container>
        {`Sorry: keinen Datensatz in Tabelle "${activeTable}" mit id "${activeId}" gefunden.`}
      </Container>
    )

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