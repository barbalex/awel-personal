import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
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

const Amt = ({ activeId }) => {
  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    showFilter,
    filterAmt,
    existsFilter,
    setFilter,
    updateField,
  } = store

  let amt
  if (showFilter) {
    amt = filterAmt
  } else {
    amt = aemter.find(p => p.id === activeId)
    if (!amt) amt = {}
  }
  const amtId = showFilter ? '' : amt.id

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [amt])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!amt && !showFilter)
        throw new Error(`Amt with id ${activeId} not found`)
      const newValue = ifIsNumericAsNumber(value)

      if (showFilter) {
        setFilter({
          model: 'filterAmt',
          value: { ...filterAmt, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'aemter',
          parentModel: 'aemter',
          field,
          value: newValue,
          id: amt.id,
          setErrors,
        })
      }
    },
    [activeId, aemter.length, filterAmt, showFilter],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== amt.leiter)
        .map(w => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [personen.length],
  )
  const kostenstelleOptions = useMemo(() =>
    sortBy(kostenstelleWerte, ['sort', 'value'])
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
            key={`${amtId}deleted`}
            value={amt.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        <Input
          key={`${amtId}name`}
          value={amt.name}
          field="name"
          label="Name"
          saveToDb={saveToDb}
          error={errors.name}
        />
        <Input
          key={`${amtId}kurzzeichen`}
          value={amt.kurzzeichen}
          field="kurzzeichen"
          label="Kurzzeichen"
          saveToDb={saveToDb}
          error={errors.kurzzeichen}
        />
        <Input
          key={`${amtId}telefonNr`}
          value={amt.telefonNr}
          field="telefonNr"
          label="Telefon"
          saveToDb={saveToDb}
          error={errors.telefonNr}
        />
        <Input
          key={`${amtId}email`}
          value={amt.email}
          field="email"
          label="Email"
          saveToDb={saveToDb}
          error={errors.email}
        />
        <Input
          key={`${amtId}standort`}
          value={amt.standort}
          field="standort"
          label="Standort"
          saveToDb={saveToDb}
          error={errors.standort}
        />
        <Select
          key={`${amtId}${existsFilter ? 1 : 0}leiter`}
          value={amt.leiter}
          field="leiter"
          label="Leiter"
          options={personOptions}
          saveToDb={saveToDb}
          error={errors.leiter}
        />
        <Select
          key={`${amtId}${existsFilter ? 1 : 0}kostenstelle`}
          value={amt.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={kostenstelleOptions}
          saveToDb={saveToDb}
          error={errors.kostenstelle}
        />
        {showMutationNoetig && (
          <SharedCheckbox
            key={`${amtId}mutationNoetig`}
            value={amt.mutationNoetig}
            field="mutationNoetig"
            label="Handlungsbedarf"
            saveToDb={saveToDb}
            error={errors.mutationNoetig}
          />
        )}
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default observer(Amt)
