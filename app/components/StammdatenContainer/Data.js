import React, { useContext, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import findIndex from 'lodash/findIndex'
import sortBy from 'lodash/sortBy'

import Input from '../shared/Input'
import SharedCheckbox from '../shared/Checkbox_01'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import tables from '../../src/tables'
import storeContext from '../../storeContext'

const Container = styled.div``
const StyledForm = styled(Form)`
  margin: 20px;
`

const Data = ({ activeId, activeTable, listRef }) => {
  const store = useContext(storeContext)
  const { showDeleted, updateField, setDirty } = store

  const dat = activeId ? store[activeTable].find(p => p.id === activeId) : []

  const [errors, setErrors] = useState({})
  useEffect(() => {
    setErrors({})
  }, [dat.id])

  useEffect(() => {
    setDirty(false)
  }, [dat.id, setDirty])

  const saveToDb = useCallback(
    ({ field, value }) => {
      const newValue = ifIsNumericAsNumber(value)
      const { parentModel } = tables.find(t => t.table === activeTable)

      updateField({
        table: activeTable,
        parentModel,
        field,
        value: newValue,
        id: dat.id,
        setErrors,
      })
      if (field === 'value') {
        let data = store[activeTable].slice().filter(p => {
          if (!showDeleted) return p.deleted === 0
          return true
        })
        data = sortBy(data, ['sort', 'value'])
        const index = findIndex(data, p => p.id === dat.id)
        listRef.current.scrollToItem(index)
      }
    },
    [updateField, activeTable, dat.id, store, listRef, showDeleted],
  )

  if (!activeId) return null
  if (!dat) {
    return (
      <Container>
        {`Sorry: keinen Datensatz in Tabelle "${activeTable}" mit id "${activeId}" gefunden.`}
      </Container>
    )
  }
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
          error={errors.id}
        />
        <Input
          key={`${dat.id}value`}
          value={dat.value}
          field="value"
          label="Wert"
          saveToDb={saveToDb}
          error={errors.value}
        />
        {showDeleted && (
          <SharedCheckbox
            key={`${dat.id}deleted`}
            value={dat.deleted}
            field="deleted"
            label="Gelöscht"
            saveToDb={saveToDb}
            error={errors.deleted}
          />
        )}
        <SharedCheckbox
          key={`${dat.id}historic`}
          value={dat.historic}
          field="historic"
          label="historisch"
          saveToDb={saveToDb}
          error={errors.historic}
        />
        <Input
          key={`${dat.id}sort`}
          value={dat.sort}
          field="sort"
          label="Sortierung"
          type="number"
          saveToDb={saveToDb}
          error={errors.sort}
        />
      </StyledForm>
    </Container>
  )
}

export default observer(Data)
