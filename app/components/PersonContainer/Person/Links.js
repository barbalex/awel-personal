// @flow
import React from 'react'
import Dropzone from 'react-dropzone'
import { shell } from 'electron'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Col, FormGroup, Label, UncontrolledTooltip } from 'reactstrap'

import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: ${props =>
    props['data-ispdf'] ? 'rgba(0, 0, 0,0)' : 'rgba(0, 0, 0,0)'};
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '1fr' : '1fr 1fr 1fr'};
  grid-template-areas: ${props =>
    props['data-ispdf'] ? "'links'" : "'links links dropzone'"};
  grid-column-gap: 8px;
  grid-row-gap: ${props => (props['data-ispdf'] ? '1px' : '8px')};
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
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
const DropzoneContainer = styled.div`
  grid-area: dropzone;
  width: 100%;
  height: 100%;
  display: ${props => (props['data-ispdf'] ? 'none' : 'block')};
  cursor: pointer;
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
  border-color: #cccccc;
  border-style: dashed;
  border-radius: 5px;
  padding: 5px;
`
const StyledA = styled.a`
  color: black;
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
  const myLinks = store.links.filter(l => l.idPerson === activePersonenId)
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'

  return (
    <FormGroup row>
      <Label for="links" sm={2}>
        Datei-Links
      </Label>
      <Col sm={10}>
        <Container data-ispdf={isPdf} name="links">
          <Links data-ispdf={isPdf}>
            {myLinks.map(link => (
              <Field key={`${link.idPerson}${link.url}`} data-ispdf={isPdf}>
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
                  data-ispdf={isPdf}
                  onClick={() => store.deleteLink(link.id)}
                  id={`removeLinkIcon${link.id}`}
                >
                  <i className="fas fa-times" />
                </RemoveGlyphiconDiv>
                <UncontrolledTooltip
                  placement="left"
                  target={`removeLinkIcon${link.id}`}
                >
                  Link entfernen
                </UncontrolledTooltip>
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
      </Col>
    </FormGroup>
  )
}

export default enhance(LinksComponent)
