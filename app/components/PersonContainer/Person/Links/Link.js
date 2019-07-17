import React, { useContext, useCallback } from 'react'
import { shell } from 'electron'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UncontrolledTooltip } from 'reactstrap'
import { FaTimes } from 'react-icons/fa'

import storeContext from '../../../../storeContext'

const Field = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: calc(100% - 20px) 20px;
  grid-gap: 0;
  border-bottom: thin solid #cccccc;
  padding: 3px;
  align-items: center;
  min-height: 35px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const UrlDiv = styled.div`
  grid-column: 1 / span 1;
  grid-column: 1;
`
const RemoveGlyphiconDiv = styled.div`
  grid-column: 2 / span 1;
  margin-top: -2px;
  display: block;
  color: #ff8f00;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: red;
  }
`
const StyledA = styled.a`
  color: black;
`

const LinkComponent = ({ link }) => {
  const store = useContext(storeContext)
  const { deleteLink } = store

  const onClickRemove = useCallback(() => deleteLink(link.id), [deleteLink, link.id])

  return (
    <Field>
      <UrlDiv>
        <StyledA
          href={link.url}
          onClick={event => {
            event.preventDefault()
            shell.openItem(link.url)
          }}
        >
          {link.url}
        </StyledA>
      </UrlDiv>
      <RemoveGlyphiconDiv
        name={link.id}
        onClick={onClickRemove}
        id={`removeLinkIcon${link.id}`}
      >
        <FaTimes />
      </RemoveGlyphiconDiv>
      <UncontrolledTooltip placement="left" target={`removeLinkIcon${link.id}`}>
        Link entfernen
      </UncontrolledTooltip>
    </Field>
  )
}

export default observer(LinkComponent)
