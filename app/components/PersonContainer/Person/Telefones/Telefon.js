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
const Nr = styled.div`
  grid-column: 1 / span 1;
`
const Typ = styled.div`
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
  grid-column: 4 / span 1;
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

const Telefon = ({ id }: { id: number | string }) => {
  const store = useContext(storeContext)
  const {
    showFilter,
    telefones,
    telefonTypWerte,
    filterTelefon,
    updateField,
    setFilter,
    deleteTelefon,
  } = store
  let telefon
  if (showFilter) {
    telefon = filterTelefon
  } else {
    telefon = telefones.find(s => s.id === id)
  }

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [telefon])

  const location = store.location.toJSON()
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const telefoneTypOptions = sortBy(telefonTypWerte, ['sort', 'value'])
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value,
    }))

  const onBlur = useCallback(({ field, value }) => {
    const newValue = ifIsNumericAsNumber(value)
    if (showFilter) {
      setFilter({
        model: 'filterTelefon',
        value: { ...filterTelefon, ...{ [field]: newValue } },
      })
    } else {
      updateField({
        table: 'telefones',
        parentModel: 'telefones',
        field,
        value: newValue,
        id,
        setErrors,
      })
    }
  }, (showFilter, filterTelefon, id))
  const onChangeSelect = useCallback(({ field, value }) => {
    const newValue = ifIsNumericAsNumber(value)
    if (showFilter) {
      setFilter({
        model: 'filterTelefon',
        value: { ...filterTelefon, ...{ [field]: newValue } },
      })
    } else {
      updateField({
        table: 'telefones',
        parentModel: 'telefones',
        field,
        value: newValue,
        id,
        setErrors,
      })
    }
  }, (showFilter, filterTelefon, id))
  const onClickDelete = useCallback(() => deleteTelefon(id), [id])

  return (
    <Row key={`${id}`} nosymbol={isPdf || showFilter}>
      <Nr>
        <InputWithoutLabel
          key={`${id}nr`}
          value={telefon.nr}
          field="nr"
          saveToDb={onBlur}
          type="text"
          error={errors.nr}
        />
      </Nr>
      <Typ>
        <Select
          key={`${id}typ`}
          value={telefon.typ}
          field="typ"
          label="Typ"
          options={telefoneTypOptions}
          saveToDb={onChangeSelect}
          error={errors.typ}
        />
      </Typ>
      <Bemerkungen>
        <InputWithoutLabel
          key={`${id}bemerkungen`}
          value={telefon.bemerkungen}
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
            id={`deleteTelefonIcon${id}`}
          >
            <FaTimes />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteTelefonIcon${id}`}
          >
            Telefon entfernen
          </UncontrolledTooltip>
        </DeleteContainer>
      )}
    </Row>
  )
}

export default observer(Telefon)
