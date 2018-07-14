const { dialog } = require('electron').remote

const options = {
  title: 'Datenbank für AWEL-Personal wählen',
  properties: ['openFile'],
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }]
}

const chooseDb = () =>
  new Promise((resolve, reject) => {
    dialog.showOpenDialog(options, result => {
      if (result && result[0]) resolve(result[0])
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('keine Datenbank gewählt')
    })
  })

export default chooseDb
