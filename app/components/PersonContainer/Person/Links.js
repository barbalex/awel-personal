// @flow
import React from 'react'
import Dropzone from 'react-dropzone'
import { shell } from 'electron'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: ${props =>
    props['data-ispdf'] ? 'rgb(227, 232, 255)' : '#e3fff0'};
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '100%' : 'calc(100% - 308px) 300px'};
  grid-template-areas: ${props =>
    props['data-ispdf']
      ? "'title' 'links'"
      : "'title dropzone' 'links dropzone'"};
  grid-column-gap: 8px;
  grid-row-gap: ${props => (props['data-ispdf'] ? '1px' : '8px')};
  padding: 8px;
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: title;
`
const Links = styled.div`
  grid-area: links;
  display: ${props => (props['data-ispdf'] ? 'grid' : 'block')};
  grid-template-columns: ${props => (props['data-ispdf'] ? '100%' : 'none')};
`
const Field = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: calc(100% - 20px) 20px;
  grid-gap: 0;
  border-bottom: thin solid #cecbcb;
  padding: 3px;
  align-items: center;
  min-height: ${props => (props['data-ispdf'] ? 0 : '35px')};
  &:first-of-type {
    border-top: thin solid #cecbcb;
  }
  &:hover {
    background-color: #ceffe5;
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
  color: red;
  font-size: 18px;
  cursor: pointer;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
`
const DropzoneContainer = styled.div`
  grid-area: dropzone;
  width: 100%;
  height: 100%;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
`
const StyledDropzone = styled(Dropzone)`
  width: 100%;
  height: 100%;
  border-color: transparent;
`
const DropzoneInnerDiv = styled.div`
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-color: #666;
  border-style: dashed;
  border-radius: 5px;
  padding: 5px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onDrop: ({ store }) => files => store.addLink(files[0].path)
  }),
  observer
)

const LinksComponent = ({
  store,
  onDrop
}: {
  store: Object,
  onDrop: () => void
}) => {
  const location = store.location.toJSON()
  if (!location[1]) throw new Error(`no id found`)
  const activePersonenId = ifIsNumericAsNumber(location[1])
  console.log('Links, render:', { activePersonenId, links: store.links })
  const myLinks = store.links.filter(l => l.idPerson === activePersonenId)
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'

  return (
    <Container data-ispdf={isPdf}>
      <Title>Links</Title>
      <Links data-ispdf={isPdf}>
        {myLinks.map(link => (
          <Field key={`${link.idPerson}${link.url}`} data-ispdf={isPdf}>
            <UrlDiv>
              <a
                href={link.url}
                onClick={event => {
                  event.preventDefault()
                  shell.openItem(link.url)
                }}
              >
                {link.url}
              </a>
            </UrlDiv>
            <RemoveGlyphiconDiv
              data-ispdf={isPdf}
              onClick={() => store.deleteLink(link.id)}
              title="Link entfernen"
              id={link.id}
            >
              <i className="fas fa-times" />
            </RemoveGlyphiconDiv>
          </Field>
        ))}
      </Links>
      <DropzoneContainer data-ispdf={isPdf}>
        <StyledDropzone onDrop={onDrop}>
          {({ isDragActive, isDragReject }) => {
            if (isDragActive) {
              return (
                <DropzoneInnerDiv>
                  <div>jetzt fallen lassen...</div>
                </DropzoneInnerDiv>
              )
            }
            if (isDragReject) {
              return (
                <DropzoneInnerDiv>
                  <div>Hm. Da ging etwas schief :-(</div>
                </DropzoneInnerDiv>
              )
            }
            return (
              <DropzoneInnerDiv>
                <div>Datei hierhin ziehen...</div>
                <div>...oder klicken, um sie zu wählen.</div>
              </DropzoneInnerDiv>
            )
          }}
        </StyledDropzone>
      </DropzoneContainer>
    </Container>
  )
}

export default enhance(LinksComponent)
