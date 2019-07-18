export default self => {
  const {
    filterPerson,
    filterPersonKader,
    filterPersonAktivJetzt,
    filterPersonAktivJetztMitTel,
    filterPersonAktivJetztMitMobiltel,
    filterPersonAktivJetztMitKurzzeichen,
    filterAmt,
    filterAbteilung,
    filterBereich,
    filterSektion,
    filterEtikett,
    filterAnwesenheitstage,
    filterLink,
    filterSchluessel,
    filterMobileAbo,
    filterTelefon,
    filterFunktion,
    filterKaderFunktion,
  } = self
  return (
    [
      ...Object.values(filterPerson),
      ...Object.values(filterAmt),
      ...Object.values(filterAbteilung),
      ...Object.values(filterBereich),
      ...Object.values(filterSektion),
      ...Object.values(filterEtikett),
      ...Object.values(filterAnwesenheitstage),
      ...Object.values(filterLink),
      ...Object.values(filterSchluessel),
      ...Object.values(filterMobileAbo),
      ...Object.values(filterTelefon),
      ...Object.values(filterFunktion),
      ...Object.values(filterKaderFunktion),
    ].filter(v => v).length > 0 ||
    filterPersonKader ||
    filterPersonAktivJetzt ||
    filterPersonAktivJetztMitTel ||
    filterPersonAktivJetztMitMobiltel ||
    filterPersonAktivJetztMitKurzzeichen
  )
}
