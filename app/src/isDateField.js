export default fieldName => {
  const dateFieldNames = [
    'geburtDatum',
    'eintrittDatum',
    'austrittDatum',
    'kostenstellenAenderungPer',
    'bueroWechselPer',
    'arbeitsplatzeroeffnungPer',
    'abmeldungArbeitsplatzPer',
    'mutationFrist',
  ]
  return dateFieldNames.includes(fieldName)
}
