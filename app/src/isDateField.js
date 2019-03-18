export default fieldName => {
  const dateFieldNames = [
    'geburtDatum',
    'eintrittDatum',
    'austrittDatum',
    'kostenstellenAenderungPer',
    'bueroWechselPer',
    'arbeitsplatzeroeffnungPer',
    'abmeldungArbeitsplatzPer',
  ]
  return dateFieldNames.includes(fieldName)
}
