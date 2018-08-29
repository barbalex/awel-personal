import React, { Fragment } from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import app from 'ampersand-app'
import { inject, observer } from 'mobx-react'
import { shell } from 'electron'

const DbPath = styled.span`
  font-style: italic;
  color: grey;
`
const MoreMenu = styled(UncontrolledDropdown)`
  width: 40px;
  > a {
    padding-left: 18px !important;
  }
`

const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/awel-personal/issues')
}

const enhance = compose(
  inject('store'),
  withHandlers({
    toggleShowDeleted: ({ store }) => () =>
      store.setShowDeleted(!store.showDeleted),
    showMutations: ({ store }) => () => store.setLocation(['mutations'])
  }),
  observer
)

const More = ({
  store,
  toggleShowDeleted,
  showMutations
}: {
  store: Object,
  toggleShowDeleted: () => void,
  showMutations: () => void
}) => {
  const { showDeleted, location } = store
  const activeLocation = location.toJSON()[0]

  return (
    <MoreMenu nav inNavbar>
      <DropdownToggle nav>
        <i className="fas fa-ellipsis-v" />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>
          Datenbank wählen (TODO)
          <br />
          <DbPath>{`Aktuell: ${app.db.name}`}</DbPath>
        </DropdownItem>
        {!activeLocation !== 'mutations' && (
          <Fragment>
            <DropdownItem divider />
            <DropdownItem onClick={showMutations}>
              Daten-Änderungen anzeigen
            </DropdownItem>
          </Fragment>
        )}
        <DropdownItem divider />
        <DropdownItem onClick={toggleShowDeleted}>
          {showDeleted
            ? 'gelöschte Datensätze verbergen'
            : 'gelöschte Datensätze anzeigen'}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={onClickIssues}>
          Fehler und Wünsche melden
        </DropdownItem>
      </DropdownMenu>
    </MoreMenu>
  )
}

export default enhance(More)
