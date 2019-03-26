import React, { useContext, useState, useCallback } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Linkify from 'react-linkify'
import { MdEdit } from 'react-icons/md'
import { Button } from 'reactstrap'

import storeContext from '../../storeContext'
import LogoAwel from '../../etc/LogoAwel.jpg'
import InputWithoutLabel from '../shared/InputWithoutLabel'

const labelWidth = 200

const Container = styled.div`
  margin: 0 15px 10px 15px;
  font-size: 12px;
  cursor: default;

  overflow-y: auto;
  padding: 0 30px;

  @media print {
    /* this is when it is actually printed */
    height: auto;
    width: auto;

    margin: 0 !important;
    padding: 0.5cm !important;
    /*padding: 1cm !important;*/
    overflow: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
// eslint-disable-next-line no-unused-expressions
const GlobalStyle = createGlobalStyle`
  @page {
    size: A4 portrait;
  }
`
const Wrapper = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  border: none;
  box-sizing: border-box;

  @media print {
    /* this is when it is actually printed */
    height: auto;
    width: auto;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    .no-print {
      display: none !important;
    }
  }
`
const Area = styled.div`
  display: grid;
  padding: 2mm 0;
  box-sizing: border-box;
`
const Cell = styled.div`
  display: grid;
  grid-template-columns: ${labelWidth}px auto;
  height: 14mm;
  box-sizing: border-box;
  > div {
    padding: 3px;
    height: 14mm;
    box-sizing: border-box;
  }
  > div:first-of-type {
    border-right: 1px solid #ccc;
  }
`
const Area1 = styled(Area)`
  grid-template-areas: 'eintritt1' 'austritt1';
  padding-bottom: 4mm;
`
const Area1Eintritt = styled(Cell)`
  grid-area: eintritt1;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area1Austritt = styled(Cell)`
  grid-area: austritt1;
  border: 1px solid #ccc;
`
const Area2 = styled(Area)`
  grid-template-areas: 'name2' 'vorname2' 'abteilung2' 'sektion2' 'kostenstelle2';
`
const Area2Name = styled(Cell)`
  grid-area: name2;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Vorname = styled(Cell)`
  grid-area: vorname2;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Abteilung = styled(Cell)`
  grid-area: abteilung2;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Sektion = styled(Cell)`
  grid-area: sektion2;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area2Kostenstelle = styled(Cell)`
  grid-area: kostenstelle2;
  border: 1px solid #ccc;
`
const Area3 = styled(Area)`
  grid-template-areas: 'title3' 'telvon3' 'rufnummer3' 'schluessel3';
`
const Area3Title = styled.div`
  grid-area: title3;
  align-self: end;
`
const Area3Telvon = styled(Cell)`
  grid-area: telvon3;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area3Rufnummer = styled(Cell)`
  grid-area: rufnummer3;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area3Schluessel = styled(Cell)`
  grid-area: schluessel3;
  border: 1px solid #ccc;
`
const Area4 = styled(Area)`
  grid-template-areas: 'title4' 'eroeffnung4' 'software4' 'hardware4' 'abmeldung4' 'bemerkungen4';
`
const Area4Title = styled.div`
  grid-area: title4;
  align-self: end;
`
const Area4Eroeffnung = styled(Cell)`
  grid-area: eroeffnung4;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Software = styled(Cell)`
  grid-area: software4;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Hardware = styled(Cell)`
  grid-area: hardware4;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Abmeldung = styled(Cell)`
  grid-area: abmeldung4;
  border: 1px solid #ccc;
  border-bottom: none;
`
const Area4Bemerkungen = styled(Cell)`
  grid-area: bemerkungen4;
  border: 1px solid #ccc;
`
const WeiterleitenRow = styled.div`
  display: flex;
`
const MainTitle = styled.div`
  font-weight: 900;
  font-size: 18px;
  font-family: Arial Black;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 14px;
  font-family: Arial Black;
`
const Img = styled.img`
  max-width: 260px;
  margin-left: -10px;
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
  margin-top: 9px;
`
const EditIcon = styled(MdEdit)`
  margin-top: -4px;
`

const PersonMutation = ({ activeId }) => {
  const store = useContext(storeContext)
  const { personen, abteilungen, sektionen, settings, setSettingsKey } = store

  const [editWeiterleiten, setEditWeiterleiten] = useState(false)

  const onClickEditWeiterleiten = useCallback(
    () => setEditWeiterleiten(!editWeiterleiten),
    [editWeiterleiten],
  )
  const onSaveWeiterleiten = useCallback(({ value }) => {
    setSettingsKey({ key: 'personMutationWeiterleiten', value })
    setEditWeiterleiten(false)
  })

  const person = personen.find(p => p.id === activeId) || {}
  const abteilung = abteilungen.find(a => a.id === person.abteilung)
  const abteilungName = abteilung && abteilung.name ? abteilung.name : ''
  const sektion = sektionen.find(a => a.id === person.sektion)
  const sektionName = sektion && sektion.name ? sektion.name : ''

  return (
    <Container className="hochformat">
      <GlobalStyle />
      <Img src={LogoAwel} />
      <MainTitle>Personal-Mutation</MainTitle>
      <Wrapper>
        <Area1>
          <Area1Eintritt>
            <div>Eintritt per:</div>
            <div />
          </Area1Eintritt>
          <Area1Austritt>
            <div>Austritt per:</div>
            <div />
          </Area1Austritt>
        </Area1>
        <Area2>
          <Area2Name>
            <div>Name</div>
            <div>{person.name}</div>
          </Area2Name>
          <Area2Vorname>
            <div>Vorname</div>
            <div>{person.vorname}</div>
          </Area2Vorname>
          <Area2Abteilung>
            <div>Abteilung</div>
            <div>{abteilungName}</div>
          </Area2Abteilung>
          <Area2Sektion>
            <div>Sektion</div>
            <div>{sektionName}</div>
          </Area2Sektion>
          <Area2Kostenstelle>
            <div>Kostenstelle</div>
            <div>{person.kostenstelle}</div>
          </Area2Kostenstelle>
        </Area2>
        <Area3>
          <Area3Title>
            <Title>Telefonmutation / Schlüssel / Badge</Title>
          </Area3Title>
          <Area3Telvon>
            <div>Telelefon übernommen von</div>
            <div />
          </Area3Telvon>
          <Area3Rufnummer>
            <div>Rufnummer</div>
            <div />
          </Area3Rufnummer>
          <Area3Schluessel>
            <div>Schlüssel / Badge benötigt?</div>
            <div />
          </Area3Schluessel>
        </Area3>
        <Area4>
          <Area4Title>
            <Title>IT Mutation</Title>
          </Area4Title>
          <Area4Eroeffnung>
            <div>Arbeitsplatzeröffnung per</div>
            <div />
          </Area4Eroeffnung>
          <Area4Software>
            <div>benötigte Software</div>
            <div />
          </Area4Software>
          <Area4Hardware>
            <div>standardabweichende Hardware</div>
            <div />
          </Area4Hardware>
          <Area4Abmeldung>
            <div>Abmeldung Arbeitsplatz per</div>
            <div />
          </Area4Abmeldung>
          <Area4Bemerkungen>
            <div>Bemerkungen</div>
            <div />
          </Area4Bemerkungen>
        </Area4>
        <WeiterleitenRow>
          {editWeiterleiten ? (
            <InputWithoutLabel
              value={settings.personMutationWeiterleiten}
              saveToDb={onSaveWeiterleiten}
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
          >
            <EditIcon />
          </StyledButton>
        </WeiterleitenRow>
      </Wrapper>
    </Container>
  )
}

export default PersonMutation
