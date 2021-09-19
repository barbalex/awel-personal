const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  shell,
  protocol,
} = require('electron')
const fs = require('fs-extra')
const path = require('path')
// needed to prevent error:
require('@babel/polyfill')
const username = require('username')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const browserWindowOptions = {
  width: 1800,
  height: 1024,
  icon: path.join(__dirname, 'src/etc/person.png'),
  // only show after it was sized
  show: false,
  webPreferences: {
    nodeIntegration: true,
    // needs to be false, see: https://github.com/electron/electron-quick-start/issues/463#issuecomment-869219170
    contextIsolation: false,
    nativeWindowOpen: true,
    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
  },
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOptions)
  mainWindow.maximize()
  Menu.setApplicationMenu(null)
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.show()

  // Open the DevTools
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // save window state on close
  mainWindow.on('close', (e) => {
    e.preventDefault()

    // in case user has changed data inside an input and not blured yet,
    // force bluring so data is saved
    mainWindow.webContents.executeJavaScript('document.activeElement.blur()')
    setTimeout(() => mainWindow.destroy(), 500)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  // creating a secure protocol is necessary to enable loading local files
  // see: https://github.com/electron/electron/issues/23393#issuecomment-623759531
  protocol.registerFileProtocol('secure-protocol', (request, callback) => {
    const url = request.url.replace('secure-protocol://', '')
    try {
      return callback(url)
    } catch (error) {
      console.error(error)
      return callback(404)
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// exceljs workbook.xlsx.writeFile does not work
// so export in main thread
ipcMain.on('SAVE_FILE', (event, path, data) => {
  fs.outputFile(path, data)
    .then(() => event.sender.send('SAVED_FILE'))
    .catch((error) => event.sender.send('ERROR', error.message))
})

ipcMain.handle('get-user-data-path', async () => {
  const path = app.getPath('userData')
  return path
})

ipcMain.handle('save-config', (event, data) => {
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'awelPersonalConfig.json')
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
  return null
})

ipcMain.handle('get-config', () => {
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'awelPersonalConfig.json')
  if (!fs.existsSync(dataFilePath)) return {}
  const configFile = fs.readFileSync(dataFilePath, 'utf-8') || {}
  if (!configFile) return {}
  return JSON.parse(configFile)
})

ipcMain.handle('reload-main-window', () => {
  mainWindow.reload()
})

ipcMain.handle(
  'print-to-pdf',
  async (event, printToPDFOptions, dialogOptions) => {
    try {
      const data = await mainWindow.webContents.printToPDF(printToPDFOptions)
      const { filePath } = await dialog.showSaveDialog(dialogOptions)
      await fs.outputFile(filePath, data)
      shell.openPath(filePath)
    } catch (error) {
      event.sender.send('ERROR', error.message)
    }
    event.sender.send('PRINTED-TO-PDF')
    return null
  },
)

// 2021.08.27: not in use becaus printed too small
ipcMain.handle('print', async (event, options) => {
  await mainWindow.webContents.print(options)
  return null
})
ipcMain.handle('save-dialog-get-path', async (event, dialogOptions) => {
  const { filePath } = await dialog.showSaveDialog(dialogOptions)
  return filePath
})
ipcMain.handle('open-dialog-get-path', async (event, dialogOptions) => {
  const { filePath } = await dialog.showOpenDialog(dialogOptions)
  return filePath
})
ipcMain.handle('get-username', async () => {
  let user
  try {
    user = await username()
  } catch (error) {
    return null
  }
  return user
})
ipcMain.handle('open-url', (event, url) => {
  return shell.openPath(url)
})
ipcMain.handle('quit', () => {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
