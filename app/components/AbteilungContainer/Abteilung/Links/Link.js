// @flow
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
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
  &:first-of-type {
    border-top: thin solid #cccccc;
  }
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
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
  color: #cccccc;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: rgba(146, 146, 146, 1);
  }
`
const StyledA = styled.a`
  color: black;
`

const LinkComponent = ({ link }: { link: Object }) => {
  const store = useContext(storeContext)
  const { deleteLink } = store
  const location = store.location.toJSON()
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'

  const onClickRemove = useCallback(() => deleteLink(link.id), [link])

  return (
    <Field data-ispdf={isPdf}>
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
        data-ispdf={isPdf}
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
