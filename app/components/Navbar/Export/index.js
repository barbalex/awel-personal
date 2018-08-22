import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { inject, observer } from 'mobx-react'

import exportPersonen from './exportPersonen'

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickExportPersonen: ({ store }) => () => {
      exportPersonen({ store })
    }
  }),
  observer
)

const Export = ({
  onClickExportPersonen
}: {
  onClickExportPersonen: () => void
}) => (
  <UncontrolledDropdown nav inNavbar>
    <DropdownToggle nav caret>
      Exporte
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem onClick={onClickExportPersonen}>
        Gefilterte Personen mit allen Feldern (TODO)
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem>mehr?</DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
)

export default enhance(Export)
