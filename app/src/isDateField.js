export default fieldName => {
  const dateFieldNames = ['geburtDatum', 'eintrittDatum', 'austrittDatum']
  return dateFieldNames.includes(fieldName)
}
