import React, { useContext, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { observer } from 'mobx-react-lite'
import last from 'lodash/last'
import useDetectPrint from 'use-detect-print'
import classnames from 'classnames'

import Person from './Person'
import PersonPrint from './PersonPrint'
import PersonMutationPrint from './PersonMutationPrint'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import storeContext from '../../storeContext'

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

  if (printing || isPrinting) {
    if (showPersonPrint) return <PersonPrint activeId={activeId} />
    if (showPersonMutationPrint)
      return <PersonMutationPrint activeId={activeId} />
  }

  return (
    <>
      <Nav tabs className={'justify-content-center'}>
        <NavItem>
          <NavLink
            className={classnames({
              active: tab === 'datenblatt',
            })}
            onClick={() => setTab('datenblatt')}
          >
            Datenblatt
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: tab === 'mutation',
            })}
            onClick={() => setTab('mutation')}
          >
            Mutation
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={tab}>
        <TabPane tabId="datenblatt">
          <Person activeId={activeId} dimensions={dimensions} />
        </TabPane>
        <TabPane tabId="mutation">
          <PersonMutationPrint activeId={activeId} />
        </TabPane>
      </TabContent>
    </>
  )
}

export default observer(PersonTab)
