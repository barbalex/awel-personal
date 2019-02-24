import React, { useContext, useCallback, useEffect, useState } from 'react'
/**
 * DANGER
 * DO NOT UPDATE REACT-DROPZONE TO 8.2 OR HIHGHER
 * There is a breaking change in 8.2 in that the path returned
 * is only the file name
 * see: https://github.com/react-dropzone/react-dropzone/issues/769
 */
import Dropzone from 'react-dropzone'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup } from 'reactstrap'

import storeContext from '../../../storeContext'
import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'

const Container = styled.div`
  grid-area: areaLinks;
  background-color: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: '1fr';
  grid-template-areas: 'dropzone';
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  border: none;
  border-bottom: none;
`
const DropzoneContainer = styled.div`
  grid-area: dropzone;
  width: 100%;
  height: 100%;
  display: block;
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
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 8px !important;
`

const PersonImage = () => {
  const store = useContext(storeContext)
  const { showFilter, updateField, personen } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const person = personen.find(p => p.id === activeId) || {}

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [person])

  const [image, setImage] = useState(null)

  useEffect(() => {
    setImage(person.bildUrl)
  }, [person.bildUrl])

  const onDrop = useCallback(files => {
    //console.log({ files })
    updateField({
      table: 'personen',
      parentModel: 'personen',
      field: 'bildUrl',
      value: files[0].path,
      id: person.id,
      setErrors,
    })
  })

  if (showFilter) return null

  return (
    <StyledFormGroup row>
      <Col sm={12}>
        <Container name="links">
          <DropzoneContainer title="Bild wählen">
            <StyledDropzone
              onDrop={onDrop}
              accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/vnd.microsoft.icon"
            >
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
                if (image) {
                  return (
                    <DropzoneInnerDiv {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img
                        src={image}
                        alt={`${person.vorname} ${person.name}`}
                        height="230"
                      />
                    </DropzoneInnerDiv>
                  )
                }
                return (
                  <DropzoneInnerDiv {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div>Bild hierhin ziehen...</div>
                    <div>...oder klicken, um es zu wählen.</div>
                  </DropzoneInnerDiv>
                )
              }}
            </StyledDropzone>
          </DropzoneContainer>
        </Container>
      </Col>
    </StyledFormGroup>
  )
}

export default observer(PersonImage)
