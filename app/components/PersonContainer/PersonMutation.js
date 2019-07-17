import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Form } from 'reactstrap'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import Linkify from 'react-linkify'
import { MdEdit } from 'react-icons/md'
import { Button } from 'reactstrap'

import Input from '../shared/Input'
import InputWithoutLabel from '../shared/InputWithoutLabel'
import Date from '../shared/Date'
import Select from '../shared/Select'
import ifIsNumericAsNumber from '../../src/ifIsNumericAsNumber'
import isDateField from '../../src/isDateField'
import storeContext from '../../storeContext'

const Container = styled.div`
  hyphens: auto;
  word-wrap: break-word;
`
const StyledForm = styled(Form)``
const WrapperNarrow = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 100%);
  grid-template-rows: auto;
  grid-template-areas: 'areaPerson' 'areaTel' 'areaIt' 'areaWeiterleiten';
`
const WrapperWide = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: auto;
  grid-template-areas:
    'areaPerson areaTel'
    'areaPerson areaIt'
    'areaWeiterleiten areaWeiterleiten';
`
const Title = styled.div`
  font-weight: 900;
  font-size: 18px;
`
const Area = styled.div`
  padding: 8px;
`
const AreaPerson = styled(Area)`
  grid-area: areaPerson;
  padding-bottom: 4mm;
`
const AreaTel = styled(Area)`
  grid-area: areaTel;
`
const AreaIt = styled(Area)`
  grid-area: areaIt;
`
const AreaWeiterleiten = styled(Area)`
  grid-area: areaWeiterleiten;
  display: flex;
`
const WeiterleitenRow = styled.div`
  display: flex;
  width: 100%;
`
const StyledButton = styled(Button)`
  background-color: rgba(0, 0, 0, 0) !important;
  padding: 0 0.5rem;
  margin-left: 8px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1) !important;
    color: black !important;
  }
`
const EditText = styled.div`
  margin-top: 6px;
`
const EditIcon = styled(MdEdit)`
  margin-top: -4px;
`

const PersonMutation = ({ activeId, dimensions }) => {
  const store = useContext(storeContext)
  const {
    personen,
    bereiche,
    sektionen,
    abteilungen,
    aemter,
    standortWerte,
    mutationArtWerte,
    showFilter,
    filterPerson,
    existsFilter,
    setFilter,
    updateField,
    settings,
    setSettingsKey,
  } = store

  let person
  if (showFilter) {
    person = filterPerson
  } else {
    person = personen.find(p => p.id === activeId)
    if (!person) person = {}
  }
  const personId = showFilter ? '' : person.id

  const [editWeiterleiten, setEditWeiterleiten] = useState(false)
  const onClickEditWeiterleiten = useCallback(
    () => setEditWeiterleiten(!editWeiterleiten),
    [editWeiterleiten],
  )
  const onSaveWeiterleiten = useCallback(({ value }) => {
    setSettingsKey({ key: 'personMutationWeiterleiten', value })
    setEditWeiterleiten(false)
  }, [setSettingsKey])

  const [errors, setErrors] = useState({})
  useEffect(() => setErrors({}), [person])

  const saveToDb = useCallback(
    ({ field, value }) => {
      // const person = personen.find(p => p.id === activeId)
      if (!person && !showFilter) {
        throw new Error(`Person with id ${activeId} not found`)
      }
      let newValue
      if (isDateField(field)) {
        if (value) {
          newValue = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
        }
        if (newValue && newValue.includes('Invalid date')) {
          newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
        }
      } else {
        newValue = ifIsNumericAsNumber(value)
      }

      if (showFilter) {
        setFilter({
          model: 'filterPerson',
          value: { ...filterPerson, ...{ [field]: newValue } },
        })
        if (field === 'amt') {
          if (person.abteilung) {
            // reset abteilung
            setFilter({
              model: 'filterPerson',
              value: { ...filterPerson, ...{ abteilung: null } },
            })
          }
          if (person.sektion) {
            // reset sektion
            setFilter({
              model: 'filterPerson',
              value: { ...filterPerson, ...{ sektion: null } },
            })
          }
        }
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          setFilter({
            model: 'filterPerson',
            value: { ...filterPerson, ...{ sektion: null } },
          })
        }
      } else {
        updateField({
          table: 'personen',
          parentModel: 'personen',
          field,
          value: newValue,
          id: person.id,
          setErrors,
        })
        if (field === 'amt') {
          if (person.abteilung) {
            // reset abteilung
            updateField({
              table: 'personen',
              parentModel: 'personen',
              field: 'abteilung',
              value: null,
              id: person.id,
              setErrors,
            })
          }
          if (person.sektion) {
            // reset sektion
            updateField({
              table: 'personen',
              parentModel: 'personen',
              field: 'sektion',
              value: null,
              id: person.id,
              setErrors,
            })
          }
        }
        if (field === 'abteilung' && person.sektion) {
          // reset sektion
          updateField({
            table: 'personen',
            parentModel: 'personen',
            field: 'sektion',
            value: null,
            id: person.id,
            setErrors,
          })
        }
      }
    },
    [person, showFilter, activeId, setFilter, filterPerson, updateField],
  )

  // filter out options with empty values - makes no sense and errors
  const personOptions = useMemo(
    () =>
      sortBy(personen, ['name', 'vorname'])
        .filter(w => !!w.name && !!w.vorname && w.deleted === 0)
        .filter(w => !showFilter && w.id !== person.id)
        .map(w => ({
          label: `${w.name} ${w.vorname}`,
          value: w.id,
        })),
    [person.id, personen, showFilter],
  )
  const mutationArtOptions = useMemo(
    () =>
      sortBy(mutationArtWerte, ['sort', 'value'])
        .filter(p => p.deleted === 0)
        .map(w => ({
          label: w.value,
          value: w.value,
        })),
    [mutationArtWerte],
  )
  const amtOptions = useMemo(
    () =>
      sortBy(aemter, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [aemter],
  )
  const abteilungOptions = useMemo(
    () =>
      sortBy(abteilungen, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .filter(w => {
          if (person.amt) {
            return w.amt === person.amt
          }
          return true
        })
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [abteilungen, person.amt],
  )
  const sektionOptions = useMemo(
    () =>
      sortBy(sektionen, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .filter(w => {
          if (person.abteilung) {
            return w.abteilung === person.abteilung
          }
          return true
        })
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [sektionen, person.abteilung],
  )
  const bereichOptions = useMemo(
    () =>
      sortBy(bereiche, ['name'])
        .filter(w => !!w.name && w.deleted === 0)
        .map(w => ({
          label: w.name,
          value: w.id,
        })),
    [bereiche],
  )
  const standortOptions = useMemo(
    () =>
      sortBy(standortWerte, ['sort', 'value'])
        .filter(p => p.deleted === 0)
        .map(w => ({
          label: w.value,
          value: w.value,
        })),
    [standortWerte],
  )

  if (!showFilter && !activeId) return null

  const { width } = dimensions
  const viewIsNarrow = width < 1500
  const Wrapper = viewIsNarrow ? WrapperNarrow : WrapperWide

  return (
    <Container showfilter={showFilter}>
      <StyledForm>
        <Wrapper>
          <AreaPerson>
            <Title>Person</Title>
            <Select
              key={`${personId}${existsFilter ? 1 : 0}mutationArt`}
              value={person.mutationArt}
              field="mutationArt"
              label="Mutations-Art"
              options={mutationArtOptions}
              saveToDb={saveToDb}
              error={errors.mutationArt}
              row={true}
            />
            <Date
              key={`${personId}${existsFilter ? 1 : 0}eintrittDatum`}
              value={person.eintrittDatum}
              field="eintrittDatum"
              label="Eintritt"
              saveToDb={saveToDb}
              error={errors.eintrittDatum}
              row={true}
            />
            <Date
              key={`${personId}${existsFilter ? 1 : 0}austrittDatum`}
              value={person.austrittDatum}
              field="austrittDatum"
              label="Austritt"
              saveToDb={saveToDb}
              error={errors.austrittDatum}
              row={true}
            />
            <Input
              key={`${personId}name`}
              value={person.name}
              field="name"
              label="Name"
              saveToDb={saveToDb}
              error={errors.name}
              row={true}
            />
            <Input
              key={`${personId}vorname`}
              value={person.vorname}
              field="vorname"
              label="Vorname"
              saveToDb={saveToDb}
              error={errors.vorname}
              row={true}
            />
            <Input
              key={`${personId}kurzzeichen`}
              value={person.kurzzeichen}
              field="kurzzeichen"
              label="Kurz&shy;zei&shy;chen"
              saveToDb={saveToDb}
              error={errors.kurzzeichen}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}amt`}
              value={person.amt}
              field="amt"
              label="Amt"
              options={amtOptions}
              saveToDb={saveToDb}
              error={errors.amt}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}abteilung`}
              value={person.abteilung}
              field="abteilung"
              label="Abtei&shy;lung"
              options={abteilungOptions}
              saveToDb={saveToDb}
              error={errors.abteilung}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}sektion`}
              value={person.sektion}
              field="sektion"
              label="Sektion"
              options={sektionOptions}
              saveToDb={saveToDb}
              error={errors.sektion}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}bereich`}
              value={person.bereich}
              field="bereich"
              label="Bereich"
              options={bereichOptions}
              saveToDb={saveToDb}
              error={errors.bereich}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}standort`}
              value={person.standort}
              field="standort"
              label="Stand&shy;ort"
              options={standortOptions}
              saveToDb={saveToDb}
              error={errors.standort}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}vorgesetztId`}
              value={person.vorgesetztId}
              field="vorgesetztId"
              label="Vorge&shy;setz&shy;te(r)"
              options={personOptions}
              saveToDb={saveToDb}
              error={errors.vorgesetztId}
              row={true}
            />
            {!showFilter && (
              <Input
                key={`${personId}kostenstelle`}
                value={person.kostenstelle}
                field="kostenstelle"
                label="Kosten&shy;stelle"
                saveToDb={() =>
                  setErrors({
                    ...errors,
                    kostenstelle:
                      'Diese Feld wird berechnet und kann nicht verändert werden',
                  })
                }
                error={errors.kostenstelle}
                row={true}
              />
            )}
            <Date
              key={`${personId}${
                existsFilter ? 1 : 0
              }kostenstellenAenderungPer`}
              value={person.kostenstellenAenderungPer}
              field="kostenstellenAenderungPer"
              label="Kosten&shy;stel&shy;le Ände&shy;rung per"
              saveToDb={saveToDb}
              error={errors.kostenstellenAenderungPer}
              row={true}
            />
            <Input
              key={`${personId}bueroNr`}
              value={person.bueroNr}
              field="bueroNr"
              label="Büro Nr."
              saveToDb={saveToDb}
              error={errors.bueroNr}
              row={true}
            />
            <Date
              key={`${personId}${existsFilter ? 1 : 0}bueroWechselPer`}
              value={person.bueroWechselPer}
              field="bueroWechselPer"
              label="Büro-Wechsel per"
              saveToDb={saveToDb}
              error={errors.bueroWechselPer}
              row={true}
            />
          </AreaPerson>
          <AreaTel>
            <Title>Telefon / Schlüssel / Badge</Title>
            <Input
              key={`${personId}rufnummer`}
              value={person.rufnummer}
              field="rufnummer"
              label="Ruf&shy;num&shy;mer"
              saveToDb={saveToDb}
              error={errors.rufnummer}
              row={true}
            />
            <Select
              key={`${personId}${existsFilter ? 1 : 0}telefonUebernommenVon`}
              value={person.telefonUebernommenVon}
              field="telefonUebernommenVon"
              label="Tele&shy;fon über&shy;nom&shy;men von"
              options={personOptions}
              saveToDb={saveToDb}
              error={errors.telefonUebernommenVon}
              row={true}
            />
            <Input
              key={`${personId}schluesselNoetig`}
              value={person.schluesselNoetig}
              field="schluesselNoetig"
              label="Schlüs&shy;sel nötig"
              saveToDb={saveToDb}
              error={errors.schluesselNoetig}
              row={true}
            />
          </AreaTel>
          <AreaIt>
            <Title>IT</Title>
            <Date
              key={`${personId}${
                existsFilter ? 1 : 0
              }arbeitsplatzeroeffnungPer`}
              value={person.arbeitsplatzeroeffnungPer}
              field="arbeitsplatzeroeffnungPer"
              label="Arbeitsplatz eröffnen per"
              saveToDb={saveToDb}
              error={errors.arbeitsplatzeroeffnungPer}
              row={true}
            />
            <Input
              key={`${personId}benoetigteSoftware`}
              value={person.benoetigteSoftware}
              field="benoetigteSoftware"
              label="Benötigte Software"
              type="textarea"
              saveToDb={saveToDb}
              error={errors.benoetigteSoftware}
              row={true}
            />
            <Input
              key={`${personId}standardabweichendeHardware`}
              value={person.standardabweichendeHardware}
              field="standardabweichendeHardware"
              label="Vom Standard abweichende Hardware"
              type="textarea"
              saveToDb={saveToDb}
              error={errors.standardabweichendeHardware}
              row={true}
            />
            <Date
              key={`${personId}${existsFilter ? 1 : 0}abmeldungArbeitsplatzPer`}
              value={person.abmeldungArbeitsplatzPer}
              field="abmeldungArbeitsplatzPer"
              label="Arbeitsplatz abmelden per"
              saveToDb={saveToDb}
              error={errors.abmeldungArbeitsplatzPer}
              row={true}
            />
            <Input
              key={`${personId}itMutationBemerkungen`}
              value={person.itMutationBemerkungen}
              field="itMutationBemerkungen"
              label="Bemerkungen zur IT"
              type="textarea"
              saveToDb={saveToDb}
              error={errors.itMutationBemerkungen}
              row={true}
            />
          </AreaIt>
          {!showFilter && (
            <AreaWeiterleiten>
              <WeiterleitenRow>
                {editWeiterleiten ? (
                  <InputWithoutLabel
                    value={settings.personMutationWeiterleiten}
                    saveToDb={onSaveWeiterleiten}
                    type="textarea"
                  />
                ) : (
                  <Linkify>
                    <EditText>{settings.personMutationWeiterleiten}</EditText>
                  </Linkify>
                )}
                <StyledButton
                  outline={true}
                  onClick={onClickEditWeiterleiten}
                  className="no-print"
                  title="Weiterleiten-Text ändern"
                >
                  <EditIcon />
                </StyledButton>
              </WeiterleitenRow>
            </AreaWeiterleiten>
          )}
        </Wrapper>
      </StyledForm>
    </Container>
  )
}

export default observer(PersonMutation)
