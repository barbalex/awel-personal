// @flow
import React, { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import sortBy from 'lodash/sortBy'

import Input from '../../shared/Input'
import Select from '../../shared/Select'
import SharedCheckbox from '../../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import Zuletzt from './Zuletzt'
import storeContext from '../../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Abteilung = ({ activeId }: { activeId: ?number }) => {
  const store = useContext(storeContext)
  const {
    personen,
    abteilungen,
    showDeleted,
    showFilter,
    filterAbteilung,
    existsFilter,
    setFilter,
  } = store

  let abteilung
  if (showFilter) {
    abteilung = filterAbteilung
  } else {
    abteilung = abteilungen.find(p => p.id === activeId)
    if (!abteilung) abteilung = {}
  }
  const abteilungId = showFilter ? '' : abteilung.id

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!abteilung && !showFilter)
        throw new Error(`Abteilung with id ${activeId} not found`)
      const newValue = ifIsNumericAsNumber(value)

      if (showFilter) {
        setFilter({
          model: 'filterAbteilung',
          value: { ...filterAbteilung, ...{ [field]: newValue } },
        })
      } else {
        store.updateField({
          table: 'abteilungen',
          parentModel: 'abteilungen',
          field,
          value: newValue,
          id: abteilung.id,
        })
      }
    },
    [activeId, abteilungen.length, filterAbteilung, showFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== abteilung.leiter)
        .map(w => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [personen.length],
  )

  if (!showFilter && !activeId) return null

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        {showDeleted && (
          <SharedCheckbox
            key={`${abteilungId}deleted`}
            value={abteilung.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
          />
        )}
        <Input
          key={`${abteilungId}name`}
          value={abteilung.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
        />
        <Input
          key={`${abteilungId}kurzzeichen`}
          value={abteilung.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
        />
        <Input
          key={`${abteilungId}telefonNr`}
          value={abteilung.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
        />
        <Input
          key={`${abteilungId}email`}
          value={abteilung.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
        />
        <Input
          key={`${abteilungId}standort`}
          value={abteilung.standort}
          field="standort"
          label="Standort"
          saveToDb={saveToDb}
        />
        <Select
          key={`${abteilungId}${existsFilter ? 1 : 0}leiter`}
          value={abteilung.leiter}
          field="leiter"
          label="Leiter"
          options={personOptions}
          saveToDb={saveToDb}
        />
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default observer(Abteilung)
