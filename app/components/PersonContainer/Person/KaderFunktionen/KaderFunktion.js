// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Input, UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'

import Select from '../Select'
import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'

const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '1fr 1fr' : '1fr 1fr 20px'};
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

const enhance = compose(
  inject('store'),
  withHandlers({
    onBlur: ({ store, id }) => event => {
      const field = event.target.name
      const value = event.target.value || null
      const { kaderFunktionen, updateField } = store
      const kaderFunktion = kaderFunktionen.find(p => p.id === id)
      if (!kaderFunktion) {
        throw new Error(`KaderFunktion with id ${id} not found`)
      }
      const newValue = ifIsNumericAsNumber(value)
      updateField({
        table: 'kaderFunktionen',
        parentModel: 'kaderFunktionen',
        field,
        value: newValue,
        id: kaderFunktion.id
      })
    },
    onChangeSelect: ({ store, id }) => ({ field, value }) => {
      const { kaderFunktionen, updateField } = store
      const kaderFunktion = kaderFunktionen.find(p => p.id === id)
      if (!kaderFunktion) {
        throw new Error(`KaderFunktion with id ${id} not found`)
      }
      const newValue = ifIsNumericAsNumber(value)
      updateField({
        table: 'kaderFunktionen',
        parentModel: 'kaderFunktionen',
        field,
        value: newValue,
        id: kaderFunktion.id
      })
    }
  }),
  observer
)

const KaderFunktion = ({
  store,
  id,
  onBlur,
  onChangeSelect
}: {
  store: Object,
  id: number,
  onBlur: () => void,
  onChangeSelect: () => void
}) => {
  const kaderFunktion = store.kaderFunktionen.find(s => s.id === id)
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const { kaderFunktionWerte } = store
  const kaderFunktionOptions = sortBy(kaderFunktionWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))

  return (
    <Row key={`${id}`} data-ispdf={isPdf}>
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
        <Input
          key={`${id}bemerkungen`}
          name="bemerkungen"
          defaultValue={kaderFunktion.bemerkungen}
          onBlur={onBlur}
          type="textarea"
          rows={1}
        />
      </Bemerkungen>
      {!isPdf && (
        <DeleteContainer>
          <Delete
            data-ispdf={isPdf}
            onClick={() => store.deleteKaderFunktion(id)}
            id={`deleteKaderFunktionIcon${id}`}
          >
            <i className="fas fa-times" />
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

export default enhance(KaderFunktion)
