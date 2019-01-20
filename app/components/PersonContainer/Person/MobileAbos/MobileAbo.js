// @flow
import React, { useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'
import { FaTimes } from 'react-icons/fa'

import Select from '../Select'
import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import InputWithoutLabel from '../../../shared/InputWithoutLabel'
import storeContext from '../../../../storeContext'

const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props.nosymbol ? '1fr 1fr 1fr' : '1fr 1fr 1fr 20px'};
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  &:first-of-type {
    border-top: thin solid #cccccc;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const Typ = styled.div`
  grid-column: 1 / span 1;
`
const Kostenstelle = styled.div`
  grid-column: 2 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
`
const DeleteContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
const Delete = styled.div`
  grid-column: 3 / span 1;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  color: #cccccc;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: rgba(146, 146, 146, 1);
  }
`

const MobileAbo = ({ id }: { id: number | string }) => {
  const store = useContext(storeContext)
  const {
    showFilter,
    mobileAbos,
    mobileAboTypWerte,
    mobileAboKostenstelleWerte,
    filterMobileAbo,
    updateField,
    setFilter,
    deleteMobileAbo,
  } = store
  let mobileAbo
  if (showFilter) {
    mobileAbo = filterMobileAbo
  } else {
    mobileAbo = mobileAbos.find(s => s.id === id)
  }

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [mobileAbo])

  const location = store.location.toJSON()
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const mobileAboTypOptions = sortBy(mobileAboTypWerte, ['sort', 'value'])
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value,
    }))
  const mobileAboKostenstelleOptions = sortBy(mobileAboKostenstelleWerte, [
    'sort',
    'value',
  ])
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value,
    }))

  const onBlur = useCallback(({ field, value }) => {
    const newValue = ifIsNumericAsNumber(value)
    if (showFilter) {
      setFilter({
        model: 'filterMobileAbo',
        value: { ...filterMobileAbo, ...{ [field]: newValue } },
      })
    } else {
      updateField({
        table: 'mobileAbos',
        parentModel: 'mobileAbos',
        field,
        value: newValue,
        id,
        setErrors,
      })
    }
  }, (showFilter, filterMobileAbo, id))
  const onChangeSelect = useCallback(({ field, value }) => {
    const newValue = ifIsNumericAsNumber(value)
    if (showFilter) {
      setFilter({
        model: 'filterMobileAbo',
        value: { ...filterMobileAbo, ...{ [field]: newValue } },
      })
    } else {
      updateField({
        table: 'mobileAbos',
        parentModel: 'mobileAbos',
        field,
        value: newValue,
        id,
        setErrors,
      })
    }
  }, (showFilter, filterMobileAbo, id))
  const onClickDelete = useCallback(() => deleteMobileAbo(id), [id])

  return (
    <Row key={`${id}`} nosymbol={isPdf || showFilter}>
      <Typ>
        <Select
          key={`${id}typ`}
          value={mobileAbo.typ}
          field="typ"
          label="Typ"
          options={mobileAboTypOptions}
          saveToDb={onChangeSelect}
          error={errors.typ}
        />
      </Typ>
      <Kostenstelle>
        <Select
          key={`${id}kostenstelle`}
          value={mobileAbo.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={mobileAboKostenstelleOptions}
          saveToDb={onChangeSelect}
          error={errors.kostenstelle}
        />
      </Kostenstelle>
      <Bemerkungen>
        <InputWithoutLabel
          key={`${id}bemerkungen`}
          value={mobileAbo.bemerkungen}
          field="bemerkungen"
          saveToDb={onBlur}
          type="textarea"
          rows={1}
          error={errors.bemerkungen}
        />
      </Bemerkungen>
      {!(isPdf || showFilter) && (
        <DeleteContainer>
          <Delete
            data-ispdf={isPdf}
            onClick={onClickDelete}
            id={`deleteMobileAboIcon${id}`}
          >
            <FaTimes />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteMobileAboIcon${id}`}
          >
            mobile Abo entfernen
          </UncontrolledTooltip>
        </DeleteContainer>
      )}
    </Row>
  )
}

export default observer(MobileAbo)
