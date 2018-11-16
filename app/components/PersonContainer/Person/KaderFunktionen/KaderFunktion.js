// @flow
import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react'
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
    props.nosymbol ? '1fr 1fr' : '1fr 1fr 20px'};
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
const Funktion = styled.div`
  grid-column: 1 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 2 / span 1;
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

const KaderFunktion = ({ id }: { id: number | string }) => {
  const store = useContext(storeContext)
  const {
    kaderFunktionWerte,
    showFilter,
    filterKaderFunktion,
    kaderFunktionen,
    updateField,
    setFilter
  } = store
  let kaderFunktion
  if (showFilter) {
    kaderFunktion = filterKaderFunktion
  } else {
    kaderFunktion = kaderFunktionen.find(s => s.id === id)
  }
  const location = store.location.toJSON()
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const kaderFunktionOptions = sortBy(kaderFunktionWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))

  const onBlur = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterKaderFunktion',
          value: { ...filterKaderFunktion, ...{ [field]: newValue } }
        })
      } else {
        updateField({
          table: 'kaderFunktionen',
          parentModel: 'kaderFunktionen',
          field,
          value: newValue,
          id: kaderFunktion.id
        })
      }
    },
    [showFilter, filterKaderFunktion, kaderFunktion.id]
  )
  const onChangeSelect = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterKaderFunktion',
          value: { ...filterKaderFunktion, ...{ [field]: newValue } }
        })
      } else {
        updateField({
          table: 'kaderFunktionen',
          parentModel: 'kaderFunktionen',
          field,
          value: newValue,
          id: kaderFunktion.id
        })
      }
    },
    [showFilter, filterKaderFunktion, kaderFunktion.id]
  )

  return (
    <Row key={`${id}`} nosymbol={isPdf || showFilter}>
      <Funktion>
        <Select
          key={`${id}funktion`}
          value={kaderFunktion.funktion}
          field="funktion"
          label="Funktion"
          options={kaderFunktionOptions}
          saveToDb={onChangeSelect}
        />
      </Funktion>
      <Bemerkungen>
        <InputWithoutLabel
          key={`${id}bemerkungen`}
          value={kaderFunktion.bemerkungen}
          field="bemerkungen"
          saveToDb={onBlur}
          type="textarea"
          rows={1}
        />
      </Bemerkungen>
      {!(isPdf || showFilter) && (
        <DeleteContainer>
          <Delete
            data-ispdf={isPdf}
            onClick={() => store.deleteKaderFunktion(id)}
            id={`deleteKaderFunktionIcon${id}`}
          >
            <FaTimes />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteKaderFunktionIcon${id}`}
          >
            Kaderfunktion entfernen
          </UncontrolledTooltip>
        </DeleteContainer>
      )}
    </Row>
  )
}

export default observer(KaderFunktion)
