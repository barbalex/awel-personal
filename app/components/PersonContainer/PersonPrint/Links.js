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
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`

export default ({ activeId }) => {
  const store = useContext(storeContext)
  const { links } = store
  const myLinks = links.filter(l => l.idPerson === activeId)

  if (myLinks.length === 0) return null

  return (
    <>
      <Label>Datei-Links</Label>
      {myLinks.map(link => (
        <Row key={link.id}>
          <Value>{link.url}</Value>
        </Row>
      ))}
    </>
  )
}
