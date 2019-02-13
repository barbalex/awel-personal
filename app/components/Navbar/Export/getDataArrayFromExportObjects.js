export default exportObjects => {
  const dataArray = []
  // first the field names:
  dataArray.push(Object.keys(exportObjects[0]).sort())
  // then the field values
  exportObjects.forEach(object =>
    dataArray.push(
      Object.keys(object)
        .sort()
        .map((key, index) => {
          /**
           * exceljs errors out if first member of array is null
           * see: https://github.com/guyonroche/exceljs/issues/111
           */
          if (object[key] === null && index === 0) {
            return ''
          }
          return object[key]
        }),
    ),
  )
  return dataArray
}
