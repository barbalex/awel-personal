// @flow
import React from 'react'
import app from 'ampersand-app'
import styled from 'styled-components'

const Container = styled.div``

const Person = () => {
  const personen = app.db.prepare('SELECT id from person limit 1').get()

  return (
    <Container>
      <div>{`id: ${personen.id}`}</div>
      <div>Hello world</div>
    </Container>
  )
}

export default Person
