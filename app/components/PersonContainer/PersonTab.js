import React, { useContext, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import classnames from 'classnames'
import styled from 'styled-components'

import Person from './Person'
import PersonPrint from './PersonPrint'
import PersonPrintFunktionen from './PersonPrintFunktionen'
import PersonPrintPensionierte from './PersonPrintPensionierte'
import PersonPrintKader from './PersonPrintKader'
import PersonPrintVerzTel from './PersonPrintVerzTel'
import PersonMutation from './PersonMutation'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

const StyledNavItem = styled(NavItem)`
  cursor: default;
  a {
    background-color: ${props =>
      props.tab === 'datenblatt' ? 'rgba(249,230,0,.3) !important' : 'unset'};
    border-bottom: ${props =>
      props.tab === 'datenblatt'
        ? '1px solid #fff9ad !important'
        : '1px solid #dee2e6'};
    user-select: none;
  }
`
const StyledTabPane = styled(TabPane)`
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 100px);
`

const PersonTab = ({ dimensions }) => {
  const store = useContext(storeContext)
  const { showFilter, activePrintForm } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null

  const [tab, setTab] = useState('datenblatt')

  if (activePrintForm === 'personalblatt') {
    return <PersonPrint activeId={activeId} />
  }
  if (activePrintForm === 'personFunktionen') {
    return <PersonPrintFunktionen />
  }
  if (activePrintForm === 'personPensionierte') {
    return <PersonPrintPensionierte />
  }
  if (activePrintForm === 'personKader') {
    return <PersonPrintKader />
  }
  if (activePrintForm === 'personVerzTel') {
    return <PersonPrintVerzTel />
  }

  if (!showFilter && !activeId) return null

  return (
    <>
      <Nav tabs>
        <StyledNavItem tab={tab}>
          <NavLink
            className={classnames({
              active: tab === 'datenblatt',
            })}
            onClick={() => setTab('datenblatt')}
          >
            Datenblatt
          </NavLink>
        </StyledNavItem>
        <StyledNavItem active={tab === 'mutation'}>
          <NavLink
            className={classnames({
              active: tab === 'mutation',
            })}
            onClick={() => setTab('mutation')}
          >
            Mutation
          </NavLink>
        </StyledNavItem>
      </Nav>
      <TabContent activeTab={tab}>
        <StyledTabPane tabId="datenblatt">
          <Person activeId={activeId} dimensions={dimensions} />
        </StyledTabPane>
        <StyledTabPane tabId="mutation">
          <PersonMutation activeId={activeId} dimensions={dimensions} />
        </StyledTabPane>
      </TabContent>
    </>
  )
}

export default observer(PersonTab)
