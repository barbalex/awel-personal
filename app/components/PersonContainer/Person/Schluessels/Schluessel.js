// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Input } from 'reactstrap'

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
const Name = styled.div`
  grid-column: 1 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 2 / span 1;
`
const Delete = styled.div`
  grid-column: 3 / span 1;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  color: #cccccc;
  font-size: 18px;
  cursor: pointer;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onBlur: ({ store, id }) => event => {
      const field = event.target.name
      const value = event.target.value || null
      const { schluessel: schluessels } = store
      const schluessel = schluessels.find(p => p.id === id)
      if (!schluessel) {
        throw new Error(`Schluessel with id ${id} not found`)
      }
      const newValue = ifIsNumericAsNumber(value)
      store.updateField({
        table: 'schluessel',
        parentModel: 'schluessel',
        field,
        value: newValue,
        id: schluessel.id
      })
    }
  }),
  observer
)

const SchluesselComponent = ({
  store,
  id,
  onBlur
}: {
  store: Object,
  id: number,
  onBlur: () => void
}) => {
  const schluessel = store.schluessel.find(s => s.id === id)
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  console.log('Schluessel rendering')

  return (
    <Row key={`${id}`} data-ispdf={isPdf}>
      <Name>
        <Input
          key={`${id}name`}
          name="name"
          defaultValue={schluessel.name}
          onBlur={onBlur}
        />
      </Name>
      <Bemerkungen>
        <Input
          key={`${id}bemerkungen`}
          name="bemerkungen"
          defaultValue={schluessel.bemerkungen}
          onBlur={onBlur}
        />
      </Bemerkungen>
      {!isPdf && (
        <Delete
          data-ispdf={isPdf}
          onClick={() => store.deleteSchluessel(id)}
          title="Schluessel entfernen"
          id={id}
        >
          <i className="fas fa-times" />
        </Delete>
      )}
    </Row>
  )
}

export default enhance(SchluesselComponent)
