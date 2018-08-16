// @flow
import React from 'react'
import app from 'ampersand-app'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { inject } from 'mobx-react'

const Container = styled.div``

const enhance = compose(inject('store'))

const Person = ({ store }: { store: Object }) => {
  const location = store.location.toJSON()
  console.log('Person:', { store, location })

  return (
    <Container>
      <div>Hello world</div>
    </Container>
  )
}

export default enhance(Person)
