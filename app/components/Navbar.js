import React from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withState('open', 'setOpen', false),
  withHandlers({
    toggle: ({ open, setOpen }) => () => {
      setOpen(!open)
    }
  })
)

const MyNavbar = ({ open, toggle }: { open: boolean, toggle: () => void }) => (
  <Navbar color="dark" dark expand="md">
    <NavbarBrand href="/">AWEL-Personal</NavbarBrand>
    <NavbarToggler onClick={toggle} />
    <Collapse isOpen={open} navbar>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink href="/">Personen</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/">Exporte</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/">Berichte</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/">Stammdaten</NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            <i className="fas fa-ellipsis-v" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Option 1</DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Reset</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Collapse>
  </Navbar>
)

export default enhance(MyNavbar)
