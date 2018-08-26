// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Input, UncontrolledTooltip } from 'reactstrap'
import sortBy from 'lodash/sortBy'

import Select from './Select'
import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'

const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '1fr 1fr 1fr' : '1fr 1fr 1fr 20px'};
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
      const { mobileAbo: mobileAbos } = store
      const mobileAbo = mobileAbos.find(p => p.id === id)
      if (!mobileAbo) {
        throw new Error(`MobileAbo with id ${id} not found`)
      }
      const newValue = ifIsNumericAsNumber(value)
      store.updateField({
        table: 'mobileAbo',
        parentModel: 'mobileAbo',
        field,
        value: newValue,
        id: mobileAbo.id
      })
    }
  }),
  observer
)

const MobileAbo = ({
  store,
  id,
  onBlur
}: {
  store: Object,
  id: number,
  onBlur: () => void
}) => {
  const mobileAbo = store.mobileAbos.find(s => s.id === id)
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const { mobileAboTypWerte, mobileAboKostenstelleWerte } = store
  const mobileAboTypOptions = sortBy(mobileAboTypWerte, 'sort')
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))
  const mobileAboKostenstelleOptions = sortBy(
    mobileAboKostenstelleWerte,
    'sort'
  )
    .filter(w => !!w.value)
    .map(w => ({
      label: w.value,
      value: w.value
    }))

  return (
    <Row key={`${id}`} data-ispdf={isPdf}>
      <Typ>
        <Select
          key={`${id}typ`}
          value={mobileAbo.typ}
          field="typ"
          label="Typ"
          options={mobileAboTypOptions}
          saveToDb={onBlur}
        />
      </Typ>
      <Kostenstelle>
        <Select
          key={`${id}kostenstelle`}
          value={mobileAbo.kostenstelle}
          field="kostenstelle"
          label="Kostenstelle"
          options={mobileAboKostenstelleOptions}
          saveToDb={onBlur}
        />
      </Kostenstelle>
      <Bemerkungen>
        <Input
          key={`${id}bemerkungen`}
          name="bemerkungen"
          defaultValue={mobileAbo.bemerkungen}
          onBlur={onBlur}
          type="textarea"
          rows={1}
        />
      </Bemerkungen>
      {!isPdf && (
        <div>
          <Delete
            data-ispdf={isPdf}
            onClick={() => store.deleteMobileAbo(id)}
            id={`deleteMobileAboIcon${id}`}
          >
            <i className="fas fa-times" />
          </Delete>
          <UncontrolledTooltip
            placement="left"
            target={`deleteMobileAboIcon${id}`}
          >
            mobile Abo entfernen
          </UncontrolledTooltip>
        </div>
      )}
    </Row>
  )
}

export default enhance(MobileAbo)
