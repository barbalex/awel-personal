// @flow
import React, { useContext, useCallback } from 'react'
import Dropzone from 'react-dropzone'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label } from 'reactstrap'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import storeContext from '../../../../storeContext'
import Link from './Link'

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

const LinksComponent = () => {
  const store = useContext(storeContext)
  const { showFilter, links, addLink } = store
  const location = store.location.toJSON()
  if (!location[1] && !showFilter) throw new Error(`no id found`)
  const activePersonenId = ifIsNumericAsNumber(location[1])
  const myLinks = links.filter(l => l.idPerson === activePersonenId)
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'

  const onDrop = useCallback(files => addLink(files[0].path))

  return (
    <FormGroup row>
      <Label for="links" sm={2}>
        Datei-Links
      </Label>
      <Col sm={10}>
        <Container data-ispdf={isPdf} name="links">
          <Links data-ispdf={isPdf}>
            {myLinks.map(link => (
              <Link key={`${link.idPerson}${link.url}`} link={link} />
            ))}
          </Links>
          <DropzoneContainer data-ispdf={isPdf}>
            <StyledDropzone onDrop={onDrop}>
              {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragReject,
              }) => {
                if (isDragActive) {
                  return (
                    <DropzoneInnerDiv {...getRootProps()}>
                      <div>jetzt fallen lassen...</div>
                    </DropzoneInnerDiv>
                  )
                }
                if (isDragReject) {
                  return (
                    <DropzoneInnerDiv {...getRootProps()}>
                      <div>Hm. Da ging etwas schief :-(</div>
                    </DropzoneInnerDiv>
                  )
                }
                return (
                  <DropzoneInnerDiv {...getRootProps()}>
                    <input {...getInputProps()} />
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

export default observer(LinksComponent)
