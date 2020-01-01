import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const Field = styled.div`
  flex: 1;
  padding: 2px;
`
const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  padding: 3px;
  background-color: ${props =>
    props.shaded ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
  page-break-inside: avoid !important;
`

function isOdd(num) {
  return num % 2
}

const PersonRow = ({ p, i }) => {
  const store = useContext(storeContext)
  const { abteilungen, sektionen, bereiche, funktionen } = store

  return (
    <Row key={p.id} shaded={!isOdd(i)}>
      <Field>{p.name || ''}</Field>
      <Field>{p.vorname || ''}</Field>
      <Field>
        {p.abteilung ? abteilungen.find(a => a.id === p.abteilung).name : ''}
      </Field>
      <Field>
        {p.sektion ? sektionen.find(a => a.id === p.sektion).name : ''}
      </Field>
      <Field>
        {p.bereich ? bereiche.find(a => a.id === p.bereich).name : ''}
      </Field>
      <Field>
        {funktionen
          .filter(f => f.idPerson === p.id)
          .filter(f => f.deleted === 0)
          .map(f => f.funktion)
          .join(', ')}
      </Field>
    </Row>
  )
}

export default observer(PersonRow)
