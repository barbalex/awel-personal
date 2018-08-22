import React from 'react'
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
      store.setShowDeleted(!store.showDeleted)
  }),
  observer
)

const More = ({
  store,
  toggleShowDeleted
}: {
  store: Object,
  toggleShowDeleted: () => void
}) => {
  const { showDeleted } = store

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
