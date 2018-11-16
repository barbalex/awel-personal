// @flow
import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Form } from 'reactstrap'

import Input from '../shared/Input'
import SharedCheckbox from '../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import tables from '../../src/tables'
import storeContext from '../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Data = ({
  activeId,
  activeTable
}: {
  activeId: ?number,
  activeTable: ?string
}) => {
  if (!activeId) return null
  const store = useContext(storeContext)
  const { showDeleted, updateField } = store
  const dat = store[activeTable].find(p => p.id === activeId)
  if (!dat) {
    return (
      <Container>
        {`Sorry: keinen Datensatz in Tabelle "${activeTable}" mit id "${activeId}" gefunden.`}
      </Container>
    )
  }

  const saveToDb = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      const { parentModel } = tables.find(t => t.table === activeTable)

      updateField({
        table: activeTable,
        parentModel,
        field,
        value: newValue,
        id: dat.id
      })
    },
    [activeTable, activeId]
  )

  return (
    <Container>
      <StyledForm>
        <Input
          key={`${dat.id}id`}
          value={dat.id}
          field="id"
          label="id"
          saveToDb={saveToDb}
          disabled
        />
        <Input
          key={`${dat.id}value`}
          value={dat.value}
          field="value"
          label="Wert"
          saveToDb={saveToDb}
        />
        {showDeleted && (
          <SharedCheckbox
            key={`${dat.id}deleted`}
            value={dat.deleted}
            field="deleted"
            label="gelöscht"
            saveToDb={saveToDb}
          />
        )}
        <SharedCheckbox
          key={`${dat.id}historic`}
          value={dat.historic}
          field="historic"
          label="historisch"
          saveToDb={saveToDb}
        />
        <Input
          key={`${dat.id}sort`}
          value={dat.sort}
          field="sort"
          label="Sortierung"
          type="number"
          saveToDb={saveToDb}
        />
      </StyledForm>
    </Container>
  )
}

export default observer(Data)
