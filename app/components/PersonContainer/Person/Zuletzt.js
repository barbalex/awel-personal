import React, { useContext } from 'react'
import moment from 'moment'
import { Col, FormGroup, Label } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

import ifIsNumericAsNumber from '../../../src/ifIsNumericAsNumber'
import storeContext from '../../../storeContext'

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: ${props => (props.row ? 'unset' : '2px !important')};
`

moment.locale('de')

const Zuletzt = ({ row = true }) => {
  const store = useContext(storeContext)
  const { personen } = store
  const location = store.location.toJSON()
  if (!location[1]) throw new Error(`no id found`)
  const activeId = ifIsNumericAsNumber(location[1])
  const person = personen.find(p => p.id === activeId)

  const Content = () =>
    person ? (
      <div name="letzteAenderung">
        {`${
          moment.unix(person.letzteMutationZeit / 1000).isValid()
            ? moment
                .unix(person.letzteMutationZeit / 1000)
                .format('DD.MM.YYYY H:mm:ss')
            : ''
        }, ${person.letzteMutationUser || ''}`}
      </div>
    ) : null
  const NonRowContainer = styled.div`
    display: flex;
  `

  return (
    <StyledFormGroup row={row}>
      {row ? (
        <>
          <Label for="letzteAenderung" sm={2}>
            Zuletzt geändert
          </Label>
          <Col sm={10}>
            <Content />
          </Col>
        </>
      ) : (
        <NonRowContainer>
          <div>Zuletzt geändert:&nbsp;</div>
          <Content />
        </NonRowContainer>
      )}
    </StyledFormGroup>
  )
}

export default observer(Zuletzt)
