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
import findIndex from 'lodash/findIndex'
import moment from 'moment'

import Input from '../../shared/Input'
import Select from '../../shared/Select'
import SharedCheckbox from '../../shared/Checkbox_01'
import Handlungsbedarf from '../../shared/Handlungsbedarf'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import Zuletzt from './Zuletzt'
import storeContext from '../../../storeContext'
import isDateField from '../../../src/isDateField'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Amt = ({ activeId, listRef }) => {
  const store = useContext(storeContext)
  const {
    personen,
    aemter,
    showDeleted,
    showMutationNoetig,
    kostenstelleWerte,
    standortWerte,
    showFilter,
    filterAmt,
    existsFilter,
    setFilter,
    updateField,
    setDirty,
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

  useEffect(() => setDirty(false), [amt, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      if (!amt && !showFilter)
        throw new Error(`Amt with id ${activeId} not found`)

      let newValue
      if (isDateField(field)) {
        if (value) {
          newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        }
        if (newValue && newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      if (showFilter) {
        setFilter({
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
        if (field === 'mutationFrist' && newValue && !amt.mutationNoetig) {
          // set mutationNoetig to true of not yet so
          updateField({
            table: 'aemter',
            parentModel: 'aemter',
            field: 'mutationNoetig',
            value: 1,
            id: amt.id,
          })
        }
        if (field === 'name') {
          const index = findIndex(
            store.aemterFilteredSortedByHandlungsbedarf,
            p => p.id === amt.id,
          )
          listRef.current.scrollToItem(index)
        }
      }
    },
    [
      activeId,
      amt,
      filterAmt,
      listRef,
      setFilter,
      showFilter,
      store.aemterFilteredSortedByHandlungsbedarf,
      updateField,
    ],
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
    [amt.leiter, personen, showFilter],
  )
  const kostenstelleOptions = useMemo(
    () =>
      sortBy(kostenstelleWerte, ['sort', 'value'])
        .filter(w => !!w.value)
        .map(w => ({
          label: w.value,
          value: w.value,
        })),
    [kostenstelleWerte],
  )
  const standortOptions = useMemo(
    () =>
      sortBy(standortWerte, ['sort', 'value'])
        .filter(p => p.deleted === 0)
        .map(w => ({
          label: w.value,
          value: w.value,
        })),
    [standortWerte],
  )

  if (!showFilter && !activeId) return null

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
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
        <Select
          key={`${amtId}${existsFilter ? 1 : 0}standort`}
          value={amt.standort}
          field="standort"
          label="Standort"
          options={standortOptions}
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
          <Handlungsbedarf
            key={`${amtId}mutationHandlungsbedarf`}
            mutationFristValue={amt.mutationFrist}
            mutationNoetigValue={amt.mutationNoetig}
            label="Handlungs&shy;bedarf"
            saveToDb={saveToDb}
            errorMutationNoetig={errors.mutationNoetig}
            errorMutationFrist={errors.mutationFrist}
          />
        )}
        {showDeleted && (
          <SharedCheckbox
            key={`${amtId}deleted`}
            value={amt.deleted}
            field="deleted"
            label="Gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        {!showFilter && <Zuletzt />}
      </StyledForm>
    </Container>
  )
}

export default observer(Amt)
