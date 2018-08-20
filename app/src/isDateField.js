// @flow

export default (fieldName: string) => {
  const dateFieldNames = ['geburtDatum', 'eintrittDatum', 'austrittDatum']
  return dateFieldNames.includes(fieldName)
}
