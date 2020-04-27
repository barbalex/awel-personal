const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const fs = require('fs-extra')
const findOpenSocket = require('./find-open-socket')
const isDev = require('electron-is-dev')

// this seems to be needed when working with server
require('@babel/polyfill')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let clientWindow
let serverWindow
let serverProcess

const browserWindowOptions = {
  width: 1800,
  height: 1024,
  icon: './src/etc/person.png',
  // only show after it was sized
  show: false,
  webPreferences: {
    nodeIntegration: true, // TODO: set false when all DB migrated to ipc
    preload: __dirname + '/client-preload.js',
  },
}

const createWindow = (socketName) => {
  // Create the browser window.
  clientWindow = new BrowserWindow(browserWindowOptions)
  clientWindow.maximize()
  !isDev && Menu.setApplicationMenu(null)
  // and load the index.html of the app.
  clientWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  clientWindow.show()

  // Open the DevTools
  if (!app.isPackaged) {
    clientWindow.webContents.openDevTools()
  }

  clientWindow.webContents.on('did-finish-load', () => {
    clientWindow.webContents.send('set-socket', {
      name: socketName,
    })
  })

  // Emitted when the window is closed.
  clientWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    clientWindow = null
  })

  // save window state on close
  clientWindow.on('close', (e) => {
    e.preventDefault()

    // in case user has changed data inside an input and not blured yet,
    // force bluring so data is saved
    clientWindow.webContents.executeJavaScript('document.activeElement.blur()')
    setTimeout(() => clientWindow.destroy(), 500)
  })
}

const createBackgroundWindow = (socketName) => {
  const win = new BrowserWindow({
    width: 1800,
    height: 1024,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.loadURL(`file://${__dirname}/server/dev.html`)

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', { name: socketName })
  })

  serverWindow = win
}

const createBackgroundProcess = (socketName) => {
  serverProcess = fork(__dirname + '/server/server.js', [
    '--subprocess',
    app.getVersion(),
    socketName,
  ])

  serverProcess.on('message', (msg) => {
    console.log(msg)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  serverSocket = await findOpenSocket()
  createWindow(serverSocket)
  if (isDev) {
    createBackgroundWindow(serverSocket)
  } else {
    createBackgroundProcess(serverSocket)
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (clientWindow === null) {
    serverSocket = await findOpenSocket()
    createWindow(serverSocket)
    if (isDev) {
      createBackgroundWindow(serverSocket)
    } else {
      createBackgroundProcess(serverSocket)
    }
  }
})

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
})

// exceljs workbook.xlsx.writeFile does not work
// so export in main thread
ipcMain.on('SAVE_FILE', (event, path, data) => {
  fs.outputFile(path, data)
    .then(() => event.sender.send('SAVED_FILE'))
    .catch((error) => event.sender.send('ERROR', error.message))
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
