/**
 * gets save path
 */

import { remote, shell } from 'electron'

import writeExport from './writeExport'
import getDataArrayFromExportObjects from './getDataArrayFromExportObjects'

const { dialog } = remote

const doExport = async ({
  exportObjects,
  setModalOpen,
  setModalMessage,
  subject,
  sorting,
}) => {
  const dialogOptions = {
    title: `exportierte ${subject} speichern`,
    filters: [
      {
        name: 'Excel-Datei',
        extensions: ['xlsx'],
      },
    ],
  }
  const { filePath: path } = await dialog.showSaveDialog(dialogOptions)
  if (path) {
    setModalMessage('Der Export wird aufgebaut...')
    setModalOpen(true)
    // set timeout so message appears before exceljs starts working
    // and possibly blocks execution of message
    setTimeout(() => {
      const dataArray = getDataArrayFromExportObjects({
        exportObjects,
        sorting,
      })
      const callback = () => {
        setModalOpen(false)
        shell.openPath(path)
      }
      try {
        writeExport(path, dataArray, callback)
      } catch (error) {
        setModalMessage(`Fehler: ${error.message}`)
        setModalOpen(true)
        setTimeout(() => setModalOpen(false), 8000)
      }
    }, 0)
  }
}

export default doExport
