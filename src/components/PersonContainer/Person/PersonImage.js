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
import { FaTimes } from 'react-icons/fa'
import { UncontrolledTooltip } from 'reactstrap'

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
  margin-bottom: 8px !important;
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
  display: grid;
  justify-content: center;
  position: relative;
`
const Img = styled.img`
  max-width: 100%;
  max-height: 350px;
`
const Text = styled.div`
  justify-self: start;
`
const RemoveIcon = styled(FaTimes)`
  display: block;
  color: #ff8f00;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
  &:hover {
    color: red;
  }
`

const PersonImage = () => {
  const store = useContext(storeContext)
  const { showFilter, updateField, personen } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const person = personen.find(p => p.id === activeId) || {}

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [person.id])

  const [image, setImage] = useState(null)

  useEffect(() => {
    setImage(person.bildUrl)
  }, [person.bildUrl])

  //console.log('PersonImage', { image, personBildUrl: person.bildUrl })

  const onDrop = useCallback(
    files => {
      //console.log({ files })
      updateField({
        table: 'personen',
        parentModel: 'personen',
        field: 'bildUrl',
        value: files[0].path,
        id: person.id,
        setErrors,
      })
    },
    [person.id, updateField],
  )
  const onClickRemove = useCallback(
    e => {
      updateField({
        table: 'personen',
        parentModel: 'personen',
        field: 'bildUrl',
        value: null,
        id: person.id,
        setErrors,
      })
      e.preventDefault()
    },
    [person.id, updateField],
  )

  if (showFilter) return null

  return (
    <Container name="links">
      <DropzoneContainer title="Bild wählen">
        <StyledDropzone
          onDrop={onDrop}
          accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/vnd.microsoft.icon"
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
            if (isDragActive) {
              return (
                <DropzoneInnerDiv {...getRootProps()}>
                  <Text>jetzt fallen lassen...</Text>
                </DropzoneInnerDiv>
              )
            }
            if (isDragReject) {
              return (
                <DropzoneInnerDiv {...getRootProps()}>
                  <Text>Hm. Da ging etwas schief :-(</Text>
                </DropzoneInnerDiv>
              )
            }
            if (image) {
              return (
                <DropzoneInnerDiv {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Img
                    src={image}
                    alt={`${person.vorname} ${person.name}`}
                    //width="185"
                  />
                  <RemoveIcon
                    id={`removeImage${person.Id}`}
                    onClick={onClickRemove}
                  />
                  <UncontrolledTooltip
                    placement="right"
                    target={`removeImage${person.Id}`}
                  >
                    Bild entfernen
                  </UncontrolledTooltip>
                </DropzoneInnerDiv>
              )
            }
            return (
              <DropzoneInnerDiv {...getRootProps()}>
                <input {...getInputProps()} />
                <Text>Bild hierhin ziehen...</Text>
                <Text>...oder klicken, um es zu wählen.</Text>
              </DropzoneInnerDiv>
            )
          }}
        </StyledDropzone>
      </DropzoneContainer>
    </Container>
  )
}

export default observer(PersonImage)
