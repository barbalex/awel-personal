import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Col, FormGroup, Label, Button } from 'reactstrap'

import ifIsNumericAsNumber from '../../../../src/ifIsNumericAsNumber'
import MobileAbo from './MobileAbo'
import storeContext from '../../../../storeContext'

const Container = styled.div`
  border: ${props => (props['data-ispdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-ispdf'] ? '10px' : 'inherit')};
`
const StyledButton = styled(Button)`
  margin-top: 5px;
`
const Row = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${props =>
    props['data-ispdf'] ? '1fr 1fr 1fr' : '1fr 1fr 1fr 20px'};
  grid-gap: 5px;
  border-bottom: thin solid #cccccc;
  padding: 3px 0;
  color: rgba(146, 146, 146, 1);
`
const Typ = styled.div`
  grid-column: 1 / span 1;
`
const Kostenstelle = styled.div`
  grid-column: 2 / span 1;
`
const Bemerkungen = styled.div`
  grid-column: 3 / span 1;
`
const NonRowLabel = styled(Label)`
  margin-bottom: 3px;
`
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? 'unset' : '8px !important')};
`

const MobileAbosComponent = ({ row = true }) => {
  const store = useContext(storeContext)
  const { showFilter, filterMobileAbo, addMobileAbo } = store
  const location = store.location.toJSON()
  if (!location[1] && !showFilter) throw new Error(`no id found`)
  const activePersonenId = ifIsNumericAsNumber(location[1])
  let mobileAbos
  if (showFilter) {
    mobileAbos = [filterMobileAbo]
  } else {
    mobileAbos = store.mobileAbos.filter(s => s.idPerson === activePersonenId)
  }
  // TODO: refactor when pdf is built
  const isPdf = location[0] === 'personPdf'
  const mayAddNew =
    !showFilter &&
    (mobileAbos.length === 0 ||
      !mobileAbos.map(s => s.name).some(n => n === null))

  const Content = () => (
    <Container data-ispdf={isPdf} name="mobileAbo">
      {mobileAbos.length > 0 && (
        <Row data-ispdf={isPdf}>
          <Typ>Typ</Typ>
          <Kostenstelle>Kostenstelle</Kostenstelle>
          <Bemerkungen>Bemerkungen</Bemerkungen>
          {!isPdf && <div />}
        </Row>
      )}
      {mobileAbos.map(mobileAbo => (
        <MobileAbo
          key={mobileAbo.id || 'filter'}
          id={mobileAbo.id || 'filter'}
        />
      ))}
      {mayAddNew && (
        <StyledButton onClick={addMobileAbo} outline>
          neues mobile Abo
        </StyledButton>
      )}
    </Container>
  )

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for="mobileAbo" sm={2}>
            Mobile Abo
          </Label>
          <Col sm={10}>
            <Content />
          </Col>
        </>
      ) : (
        <>
          <NonRowLabel for="mobileAbo">Mobile Abo</NonRowLabel>
          <Content />
        </>
      )}
    </StyledFormGroup>
  )
}

export default observer(MobileAbosComponent)
