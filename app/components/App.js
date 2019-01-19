// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { de } from 'date-fns/locale'

import Navbar from './Navbar'
import PersonContainer from './PersonContainer'
import AmtContainer from './AmtContainer'
import AbteilungContainer from './AbteilungContainer'
import SektionContainer from './SektionContainer'
import StammdatenContainer from './StammdatenContainer'
import DeletionModal from './DeletionModal'
import Mutations from './Mutations'
import storeContext from '../storeContext'

registerLocale('de', de)
setDefaultLocale('de')

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`

const App = () => {
  const store = useContext(storeContext)
  const activeLocation = store.location.toJSON()[0]

  return (
    <Container>
      <Navbar />
      {activeLocation === 'Personen' && <PersonContainer />}
      {activeLocation === 'Aemter' && <AmtContainer />}
      {activeLocation === 'Sektionen' && <SektionContainer />}
      {activeLocation === 'Abteilungen' && <AbteilungContainer />}
      {activeLocation.includes('Werte') && <StammdatenContainer />}
      {activeLocation === 'mutations' && <Mutations />}
      <DeletionModal />
    </Container>
  )
}

export default observer(App)
