// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject, observer } from 'mobx-react'

const Container = styled.div``

const enhance = compose(
  inject('store'),
  observer
)

const Person = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  let activeId = location[1]
  if (!isNaN(activeId)) activeId = +activeId
  const { personen } = store
  const person = personen.find(p => p.id === activeId)
  console.log('Person:', { location, person })

  return (
    <Container>
      <div>Hello world</div>
    </Container>
  )
}

export default enhance(Person)
