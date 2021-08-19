/**
 * gets save path
 */
import { ipcRenderer } from 'electron'

import writeExport from './writeExport'
import getDataArrayFromExportObjects from './getDataArrayFromExportObjects'

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
  const path = await ipcRenderer.invoke('save-dialog-get-path', dialogOptions)
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
        ipcRenderer.invoke('open-url', path)
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
