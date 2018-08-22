/**
 * gets save path
 */

import { remote, shell } from 'electron'

import writeExport from './writeExport'
import getDataArrayFromExportObjects from './getDataArrayFromExportObjects'

const { dialog } = remote

export default (geschaefte, messageShow) => {
  const dialogOptions = {
    title: 'exportierte Geschäfte speichern',
    filters: [
      {
        name: 'Excel-Datei',
        extensions: ['xlsx']
      }
    ]
  }
  dialog.showSaveDialog(dialogOptions, path => {
    if (path) {
      messageShow(true, 'Der Export wird aufgebaut...', '')
      // set timeout so message appears before exceljs starts working
      // and possibly blocks execution of message
      setTimeout(() => {
        const dataArray = getDataArrayFromExportObjects(geschaefte)
        writeExport(path, dataArray)
          .then(() => {
            messageShow(false, '', '')
            shell.openItem(path)
          })
          .catch(error => {
            messageShow(true, 'Fehler:', error)
            setTimeout(() => messageShow(false, '', ''), 8000)
          })
      }, 0)
    }
  })
}
