import React, { useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { FaTimes, FaEdit, FaFilter } from 'react-icons/fa'

import storeContext from '../../storeContext'

const VolltextInput = styled(Input)`
  background-color: ${props =>
    props.existsfilter === 'true' ? '#f7f791 !important' : '#e9ecef'};
`
const VolltextFilterRemoveAddon = styled(InputGroupText)`
  background-color: #f7f791 !important;
`
const StyledInputGroupText = styled(InputGroupText)`
  background-color: ${props =>
    props.existsfilter === 'true' ? '#f7f791 !important' : '#e9ecef'};
`
const FilterIconContainer = styled.div`
  padding-right: 10px;
`
const StyledDropdown = styled(Dropdown)`
  margin-right: -12px;
  margin-top: -8px;
  margin-bottom: -8px;
  min-width: 23px;
  min-height: 38px;
  .dropdown-toggle {
    min-height: 38px;
    padding-top: 5px;
    padding-right: 4px;
    min-width: 23px;
    border-left: 1px solid #ced4da;
  }
`

const Filter = () => {
  const store = useContext(storeContext)
  const {
    showFilter,
    setShowFilter,
    filterFulltext,
    setFilterFulltext,
    setFilter,
    setShowMutationNoetig,
    existsFilter,
    personPages,
    activePrintForm,
    setFilterPersonKader,
    setFilterPersonAktivJetzt,
    setFilterPersonAktivJetztMitTel,
    setFilterPersonAktivJetztMitMobiltel,
    setFilterPersonAktivJetztMitKurzzeichen,
  } = store

  const location = store.location.toJSON()
  const activeLocation = location[0]

  const [filterDropdownIsOpen, setFilterDropdownIsOpen] = useState(false)

  const toggleShowFilter = useCallback(() => setShowFilter(!showFilter), [
    showFilter,
  ])
  const onChangeFilterFulltext = useCallback(e => {
    setFilterFulltext(e.target.value)
  })
  const onBlurFilterFulltext = useCallback(
    e => {
      if (
        [
          'personFunktionen',
          'personPensionierte',
          'personKader',
          'personVerzTel',
          'personVerzMobiltel',
          'personVerzKurzzeichen',
        ].includes(activePrintForm)
      ) {
        personPages.initiate()
      }
    },
    [activePrintForm],
  )
  const onKeyPressFilterFulltext = useCallback(e => {
    if (e.key === 'Enter') {
      onBlurFilterFulltext(e)
    }
  })
  const onEmptyFilterFulltext = useCallback(() => {
    setFilterFulltext(null)
    if (
      [
        'personFunktionen',
        'personPensionierte',
        'personKader',
        'personVerzTel',
        'personVerzMobiltel',
        'personVerzKurzzeichen',
      ].includes(activePrintForm)
    ) {
      personPages.initiate()
    }
  }, [activePrintForm])
  const toggleFilterDropdown = useCallback(
    e => {
      setFilterDropdownIsOpen(!filterDropdownIsOpen)
      e.stopPropagation()
    },
    [filterDropdownIsOpen],
  )
  const onClickAnstehendeMutationen = useCallback(() => {
    let model
    switch (activeLocation) {
      case 'Aemter':
        model = 'filterAmt'
        break
      case 'Abteilungen':
        model = 'filterAbteilung'
        break
      case 'Sektionen':
        model = 'filterSektion'
        break
      case 'Bereiche':
        model = 'filterBereich'
        break
      case 'Personen':
      default:
        model = 'filterPerson'
    }
    setFilter({ model, value: { mutationNoetig: 1 } })
    setShowMutationNoetig(true)
  }, [activeLocation])
  const onClickKader = useCallback(() => {
    setFilterPersonKader(true)
  }, [activeLocation])
  const onClickAktivJetzt = useCallback(() => {
    setFilterPersonAktivJetzt(true)
  }, [activeLocation])
  const onClickAktivJetztMitTel = useCallback(() => {
    setFilterPersonAktivJetztMitTel(true)
  }, [activeLocation])
  const onClickAktivJetztMitMobiltel = useCallback(() => {
    setFilterPersonAktivJetztMitMobiltel(true)
  }, [activeLocation])
  const onClickAktivJetztMitKurzzeichen = useCallback(() => {
    setFilterPersonAktivJetztMitKurzzeichen(true)
  }, [activeLocation])

  return (
    <div>
      <InputGroup>
        <VolltextInput
          placeholder="Volltext filtern"
          onChange={onChangeFilterFulltext}
          onBlur={onBlurFilterFulltext}
          value={filterFulltext || ''}
          onKeyPress={onKeyPressFilterFulltext}
          existsfilter={!!filterFulltext ? 'true' : 'false'}
        />
        <InputGroupAddon addonType="append">
          {filterFulltext && (
            <VolltextFilterRemoveAddon
              id="volltextFilterRemoveAddon"
              onClick={onEmptyFilterFulltext}
            >
              <FaTimes />
            </VolltextFilterRemoveAddon>
          )}
          <StyledInputGroupText
            id="filterAddon"
            onClick={toggleShowFilter}
            existsfilter={existsFilter.toString()}
          >
            <FilterIconContainer>
              {showFilter ? <FaEdit /> : <FaFilter />}
            </FilterIconContainer>
            {filterFulltext && (
              <UncontrolledTooltip
                placement="left"
                target="volltextFilterRemoveAddon"
              >
                Volltext-Filter leeren
              </UncontrolledTooltip>
            )}
            <UncontrolledTooltip placement="left" target="filterAddon">
              {showFilter ? 'Daten bearbeiten' : 'Nach Feldern filtern'}
            </UncontrolledTooltip>
            {existsFilter && (
              <UncontrolledTooltip placement="left" target="emptyFilterAddon">
                Filter leeren
              </UncontrolledTooltip>
            )}
            <StyledDropdown
              isOpen={filterDropdownIsOpen}
              toggle={toggleFilterDropdown}
            >
              <DropdownToggle caret tag="div">
                {' '}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>vorbereitete Filter</DropdownItem>
                <DropdownItem onClick={onClickAnstehendeMutationen}>
                  Anstehende Mutationen
                </DropdownItem>
                {activeLocation === 'Personen' && (
                  <>
                    <DropdownItem onClick={onClickAktivJetzt}>
                      aktuell aktiv (bereits eingetreten)
                    </DropdownItem>
                    <DropdownItem onClick={onClickAktivJetztMitTel}>
                      aktuell aktiv, mit Telefon
                    </DropdownItem>
                    <DropdownItem onClick={onClickAktivJetztMitMobiltel}>
                      aktuell aktiv, mit Mobil-Telefon
                    </DropdownItem>
                    <DropdownItem onClick={onClickAktivJetztMitKurzzeichen}>
                      aktuell aktiv, mit Kurzzeichen
                    </DropdownItem>
                    <DropdownItem onClick={onClickKader}>Kader</DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </StyledDropdown>
          </StyledInputGroupText>
          {existsFilter && (
            <StyledInputGroupText
              id="emptyFilterAddon"
              onClick={store.emptyFilter}
              existsfilter={existsFilter.toString()}
            >
              <FaTimes />
            </StyledInputGroupText>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default observer(Filter)
