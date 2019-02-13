/**
 * gets save path
 */

import { remote, shell } from 'electron'

import writeExport from './writeExport'
import getDataArrayFromExportObjects from './getDataArrayFromExportObjects'

const { dialog } = remote

export default ({ exportObjects, setModalOpen, setModalMessage, subject }) => {
  const dialogOptions = {
    title: `exportierte ${subject} speichern`,
    filters: [
      {
        name: 'Excel-Datei',
        extensions: ['xlsx'],
      },
    ],
  }
  dialog.showSaveDialog(dialogOptions, path => {
    if (path) {
      setModalMessage('Der Export wird aufgebaut...')
      setModalOpen(true)
      // set timeout so message appears before exceljs starts working
      // and possibly blocks execution of message
      setTimeout(async () => {
        const dataArray = getDataArrayFromExportObjects(exportObjects)
        try {
          await writeExport(path, dataArray)
        } catch (error) {
          setModalMessage(`Fehler: ${error.message}`)
          setModalOpen(true)
          setTimeout(() => setModalOpen(false), 8000)
        }
        setModalOpen(false)
        shell.openItem(path)
      }, 0)
    }
  })
}
