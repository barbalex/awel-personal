// @flow
import React, { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'

import Input from '../../shared/Input'
import Select from '../../shared/Select'
import SharedCheckbox from '../../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import isDateField from '../../../src/isDateField'
import Zuletzt from './Zuletzt'
import storeContext from '../../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Sektion = ({ activeId }: { activeId: ?number }) => {
  const store = useContext(storeContext)
  const {
    personen,
    sektionen,
    showDeleted,
    kostenstelleWerte,
    showFilter,
    filterSektion,
    existsFilter,
    setFilter,
  } = store

  let sektion
  if (showFilter) {
    sektion = filterSektion
  } else {
    sektion = sektionen.find(p => p.id === activeId)
    if (!sektion) sektion = {}
  }
  const sektionId = showFilter ? '' : sektion.id

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!sektion && !showFilter)
        throw new Error(`Sektion with id ${activeId} not found`)
      let newValue
      if (isDateField(field)) {
        if (value) newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        if (newValue && newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      if (showFilter) {
        setFilter({
          model: 'filterSektion',
          value: { ...filterSektion, ...{ [field]: newValue } },
        })
      } else {
        store.updateField({
          table: 'sektionen',
          parentModel: 'sektionen',
          field,
          value: newValue,
          id: sektion.id,
        })
      }
    },
    [activeId, sektionen.length, filterSektion, showFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== sektion.leiter)
        .map(w => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [personen.length],
  )
  const kostenstelleOptions = useMemo(() =>
    sortBy(kostenstelleWerte, 'sort')
      .filter(w => !!w.value)
      .map(w => ({
        label: w.value,
        value: w.value,
      })),
  )

  if (!showFilter && !activeId) return null

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${sektionId}deleted`}
            value={sektion.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
          />
        )}
        <Input
          key={`${sektionId}name`}
          value={sektion.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
        />
        <Input
          key={`${sektionId}kurzzeichen`}
          value={sektion.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
        />
        <Input
          key={`${sektionId}telefonNr`}
          value={sektion.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
        />
        <Input
          key={`${sektionId}email`}
          value={sektion.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
        />
        <Input
          key={`${sektionId}standort`}
          value={sektion.standort}
          field="standort"
          label="Standort"
          saveToDb={saveToDb}
        />
        <Select
          key={`${sektionId}${existsFilter ? 1 : 0}leiter`}
          value={sektion.leiter}
          field="leiter"
          label="Leiter"
          options={personOptions}
          saveToDb={saveToDb}
        />
        <Select
          key={`${sektionId}${existsFilter ? 1 : 0}kostenstelle`}
          value={sektion.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={kostenstelleOptions}
          saveToDb={saveToDb}
        />
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default observer(Sektion)
