import React, { useContext, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import last from 'lodash/last'
import useDetectPrint from 'use-detect-print'
import classnames from 'classnames'
import styled from 'styled-components'

import Person from './Person'
import PersonPrint from './PersonPrint'
import PersonMutation from './PersonMutation'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

const StyledNavItem = styled(NavItem)`
  cursor: default;
  a {
    background-color: ${props => (props.active ? '#eee !important' : 'unset')};
    border-bottom-color: ${props =>
      props.active ? '#eee !important' : 'unset'};
    user-select: none;
  }
`

const PersonTab = ({ dimensions }) => {
  const store = useContext(storeContext)
  const { printing } = store
  const location = store.location.toJSON()
  const activeId = location[1] ? ifIsNumericAsNumber(location[1]) : null
  const isPrinting = useDetectPrint()

  const [tab, setTab] = useState('datenblatt')

  const showPersonPrint = location.length === 3 && last(location) === 'pdf'
  const showPersonMutationPrint =
    location.length === 4 && last(location) === 'pdf'

  if (showPersonPrint) return <PersonPrint activeId={activeId} />
  if (printing || isPrinting) {
    if (showPersonPrint) return <PersonPrint activeId={activeId} />
    if (showPersonMutationPrint)
      return <PersonMutation activeId={activeId} />
  }

  if (!activeId) return null

  return (
    <>
      <Nav tabs>
        <StyledNavItem active={tab === 'datenblatt'}>
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
        <TabPane tabId="datenblatt">
          <Person activeId={activeId} dimensions={dimensions} />
        </TabPane>
        <TabPane tabId="mutation">
          <PersonMutation activeId={activeId} />
        </TabPane>
      </TabContent>
    </>
  )
}

export default observer(PersonTab)
