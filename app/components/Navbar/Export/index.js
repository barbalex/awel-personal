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

import personenPrepareData from './personenPrepareData'
import personenExport from './personenExport'

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickExportPersonen: ({ store }) => () => {
      const personenReadable = personenPrepareData({ store })
      personenExport(personenReadable)
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
