import React, { useContext } from 'react'
import styled from 'styled-components'

import storeContext from '../../../storeContext'

const Label = styled.label`
  font-size: smaller;
  margin-bottom: 0;
`
const Value = styled.p`
  margin-bottom: 0;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`
const Nr = styled.div`
  grid-column: 1 / span 1;
  font-size: smaller;
`
const Typ = styled.div`
  grid-column: 2 / span 1;
  font-size: smaller;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
  font-size: smaller;
`

export default ({ activeId }) => {
  const store = useContext(storeContext)
  const telefones = store.telefones.filter(s => s.idPerson === activeId)

  if (telefones.length === 0) return null

  return (
    <>
      <Label>Telefon</Label>
      <Row>
        <Nr>Nr.</Nr>
        <Typ>Typ</Typ>
        <Bemerkungen>Bemerkungen</Bemerkungen>
      </Row>
      {telefones.map(telefon => (
        <Row key={telefon.id}>
          <Nr>
            <Value>{telefon.nr}</Value>
          </Nr>
          <Typ>
            <Value>{telefon.typ}</Value>
          </Typ>
          <Bemerkungen>
            <Value>{telefon.bemerkungen}</Value>
          </Bemerkungen>
        </Row>
      ))}
    </>
  )
}
