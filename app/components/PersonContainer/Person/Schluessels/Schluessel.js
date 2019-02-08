import React, { useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTimes } from 'react-icons/fa'
import sortBy from 'lodash/sortBy'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import InputWithoutLabel from '../../../shared/InputWithoutLabel'
import storeContext from '../../../../storeContext'
import Select from '../Select'

const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props.nosymbol ? '2fr 2fr 2fr 1fr' : '2fr 2fr 2fr 1fr 20px'};
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
const Anlage = styled.div`
  grid-column: 2 / span 1;
`
const Bezeichnung = styled.div`
  grid-column: 3 / span 1;
`
const Nr = styled.div`
  grid-column: 4 / span 1;
`
const Delete = styled.div`
  grid-column: 5 / span 1;
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

const SchluesselComponent = ({ id }) => {
  const store = useContext(storeContext)
  const {
    showFilter,
    filterSchluessel,
    setFilter,
    deleteSchluessel,
    schluesselTypWerte,
    schluesselAnlageWerte,
    updateField,
    filterSchluesselTyp,
    filterSchluesselAnlage,
  } = store
  let schluessel
  if (showFilter) {
    schluessel = filterSchluessel
  } else {
    schluessel = store.schluessel.find(s => s.id === id)
  }

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [schluessel])

  const location = store.location.toJSON()
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const schluesselTypOptions = sortBy(schluesselTypWerte, ['sort', 'value'])
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value,
    }))
  const schluesselAnlageOptions = sortBy(schluesselAnlageWerte, [
    'sort',
    'value',
  ])
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value,
    }))

  const onBlur = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterSchluessel',
          value: { ...filterSchluessel, ...{ [field]: newValue } },
        })
      } else {
        updateField({
          table: 'schluessel',
          parentModel: 'schluessel',
          field,
          value: newValue,
          id: schluessel.id,
          setErrors,
        })
      }
    },
    [showFilter, filterSchluessel, id],
  )
  const onChangeSelectSchluesselTyp = useCallback(({ field, value }) => {
    const newValue = ifIsNumericAsNumber(value)
    if (showFilter) {
      setFilter({
        model: 'filterSchluesselTyp',
        value: { ...filterSchluesselTyp, ...{ [field]: newValue } },
      })
    } else {
      updateField({
        table: 'schluessel',
        parentModel: 'schluessel',
        field,
        value: newValue,
        id,
        setErrors,
      })
    }
  }, (showFilter, filterSchluesselTyp, id))
  const onChangeSelectSchluesselAnlage = useCallback(({ field, value }) => {
    const newValue = ifIsNumericAsNumber(value)
    if (showFilter) {
      setFilter({
        model: 'filterSchluesselAnlage',
        value: { ...filterSchluesselAnlage, ...{ [field]: newValue } },
      })
    } else {
      updateField({
        table: 'schluessel',
        parentModel: 'schluessel',
        field,
        value: newValue,
        id,
        setErrors,
      })
    }
  }, (showFilter, filterSchluesselAnlage, id))
  const onClickDelete = useCallback(() => deleteSchluessel(id), [id])

  return (
    <Row key={`${id}`} nosymbol={isPdf || showFilter}>
      <Typ>
        <Select
          key={`${id}typ`}
          value={schluessel.typ}
          field="typ"
          label="Typ"
          options={schluesselTypOptions}
          saveToDb={onChangeSelectSchluesselTyp}
          error={errors.typ}
        />
      </Typ>
      <Anlage>
        <Select
          key={`${id}anlage`}
          value={schluessel.anlage}
          field="anlage"
          label="Anlage"
          options={schluesselAnlageOptions}
          saveToDb={onChangeSelectSchluesselAnlage}
          error={errors.anlage}
        />
      </Anlage>
      <Bezeichnung>
        <InputWithoutLabel
          key={`${id}bezeichnung`}
          value={schluessel.bezeichnung}
          field="bezeichnung"
          saveToDb={onBlur}
          type="textarea"
          rows={1}
          error={errors.bezeichnung}
        />
      </Bezeichnung>
      <Nr>
        <InputWithoutLabel
          key={`${id}nr`}
          value={schluessel.nr}
          field="nr"
          saveToDb={onBlur}
          type="text"
          error={errors.nr}
        />
      </Nr>
      {!(isPdf || showFilter) && (
        <>
          <Delete
            data-ispdf={isPdf}
            onClick={onClickDelete}
            id={`deleteSchluesselIcon${id}`}
          >
            <FaTimes />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteSchluesselIcon${id}`}
          >
            Schlüssel entfernen
          </UncontrolledTooltip>
        </>
      )}
    </Row>
  )
}

export default observer(SchluesselComponent)
