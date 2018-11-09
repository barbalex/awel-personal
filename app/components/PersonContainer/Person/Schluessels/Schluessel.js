// @flow
import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTimes } from 'react-icons/fa'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import InputWithoutLabel from '../../../shared/InputWithoutLabel'

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
  &:hover {
    color: rgba(146, 146, 146, 1);
  }
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onBlur: ({ store, id }) => ({ field, value }) => {
      const {
        schluessel: schluessels,
        showFilter,
        filterSchluessel,
        setFilter
      } = store
      const newValue = ifIsNumericAsNumber(value)
      if (showFilter) {
        setFilter({
          model: 'filterSchluessel',
          value: { ...filterSchluessel, ...{ [field]: newValue } }
        })
      } else {
        const schluessel = schluessels.find(p => p.id === id)
        if (!schluessel) {
          throw new Error(`Schluessel with id ${id} not found`)
        }
        store.updateField({
          table: 'schluessel',
          parentModel: 'schluessel',
          field,
          value: newValue,
          id: schluessel.id
        })
      }
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
  id: number | string,
  onBlur: () => void
}) => {
  const { showFilter, filterSchluessel } = store
  let schluessel
  if (showFilter) {
    schluessel = filterSchluessel
  } else {
    schluessel = store.schluessel.find(s => s.id === id)
  }
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'

  return (
    <Row key={`${id}`} nosymbol={isPdf || showFilter}>
      <Name>
        <InputWithoutLabel
          key={`${id}name`}
          value={schluessel.name}
          field="name"
          saveToDb={onBlur}
        />
      </Name>
      <Bemerkungen>
        <InputWithoutLabel
          key={`${id}bemerkungen`}
          value={schluessel.bemerkungen}
          field="bemerkungen"
          saveToDb={onBlur}
          type="textarea"
          rows={1}
        />
      </Bemerkungen>
      {!(isPdf || showFilter) && (
        <Fragment>
          <Delete
            data-ispdf={isPdf}
            onClick={() => store.deleteSchluessel(id)}
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
        </Fragment>
      )}
    </Row>
  )
}

export default enhance(SchluesselComponent)
