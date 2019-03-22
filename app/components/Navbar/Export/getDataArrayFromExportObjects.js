import sortBy from 'lodash/sortBy'

export default ({ exportObjects, sorting }) => {
  const dataArray = []
  // first the field names:
  dataArray.push(
    sortBy(Object.keys(exportObjects[0]), key => {
      if (sorting) {
        return sorting[key]
      }
      return key
    }),
  )
  // then the field values
  exportObjects.forEach(object => {
    return dataArray.push(
      sortBy(Object.keys(object), key => {
        if (sorting) {
          return sorting[key]
        }
        return key
      }).map((key, index) => {
        /**
         * exceljs errors out if first member of array is null
         * see: https://github.com/guyonroche/exceljs/issues/111
         */
        if (object[key] === null && index === 0) {
          return ''
        }
        return object[key]
      }),
    )
  })
  return dataArray
}
