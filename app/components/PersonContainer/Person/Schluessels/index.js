import React, { useContext, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button, ButtonGroup } from 'reactstrap'
import { MdEdit } from 'react-icons/md'
import { shell } from 'electron'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import Schluessel from './Schluessel'
import storeContext from '../../../../storeContext'

const Container = styled.div`
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const StyledButton = styled(Button)`
  margin-top: 5px;
`
const EFButtonGroup = styled(ButtonGroup)`
  margin-left: 5px;
  margin-top: 5px;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '2fr 2fr 2fr 1fr' : '2fr 2fr 2fr 1fr 20px'};
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`
const Typ = styled.div`
  grid-column: 1 / span 1;
`
const Anlage = styled.div`
  grid-column: 2 / span 1;
`
const Bezeichnung = styled.div`
  grid-column: 3 / span 1;
`
const Nr = styled.div`
  grid-column: 4 / span 1;
`
const EditIcon = styled(MdEdit)`
  margin-top: -4px;
`

const SchluesselsComponent = () => {
  const store = useContext(storeContext)
  const {
    showFilter,
    filterSchluessel,
    addSchluessel,
    settings,
    setSettingsKey,
  } = store
  const uploader = useRef(null)

  const location = store.location.toJSON()
  if (!location[1] && !showFilter) throw new Error(`no id found`)
  const activePersonenId = ifIsNumericAsNumber(location[1])
  let schluessels
  if (showFilter) {
    schluessels = [filterSchluessel]
  } else {
    schluessels = store.schluessel.filter(s => s.idPerson === activePersonenId)
  }
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const mayAddNew =
    !showFilter &&
    (schluessels.length === 0 ||
      !schluessels.map(s => s.name).some(n => n === null))

  const onClickChangePath = useCallback(() => uploader.current.click())
  const onChangeFormPath = useCallback(event => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    if (file && file.path) {
      setSettingsKey({ key: 'schluesselFormPath', value: file.path })
    } else {
      console.log('Path not set')
    }
  })
  const onClickForm = useCallback(() => {
    let success = false
    if (settings.schluesselFormPath) {
      success = shell.openItem(settings.schluesselFormPath)
      if (!success) console.log('File could not be opened')
      return
    }
    console.log('no schluesselFormPath to open')
  }, [settings.schluesselFormPath])

  return (
    <FormGroup row>
      <Label for="schluessel" sm={2}>
        Schlüssel
      </Label>
      <Col sm={10}>
        <Container data-ispdf={isPdf} name="schluessel">
          {schluessels.length > 0 && (
            <Row data-ispdf={isPdf}>
              <Typ>Typ</Typ>
              <Anlage>Anlage</Anlage>
              <Bezeichnung>Bezeichnung</Bezeichnung>
              <Nr>Nr.</Nr>
              {!isPdf && <div />}
            </Row>
          )}
          {schluessels.map(schluessel => (
            <Schluessel
              key={schluessel.id || 'filter'}
              id={schluessel.id || 'filter'}
            />
          ))}
          {mayAddNew && (
            <StyledButton onClick={addSchluessel} outline>
              neuer Schlüssel
            </StyledButton>
          )}
          <EFButtonGroup>
            <Button
              onClick={onClickForm}
              outline
              title={settings.schluesselFormPath || ''}
            >
              Empfangsformular
            </Button>
            <Button title="Pfad ändern" outline onClick={onClickChangePath}>
              <EditIcon size="22" id={`editIcon${activePersonenId}`} />
              <input
                type="file"
                id="file"
                ref={uploader}
                style={{ display: 'none' }}
                onChange={onChangeFormPath}
              />
            </Button>
          </EFButtonGroup>
        </Container>
      </Col>
    </FormGroup>
  )
}

export default observer(SchluesselsComponent)
