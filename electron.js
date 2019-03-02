const path = require('path')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
const IS_PROD = process.env.NODE_ENV !== 'development'

let mainWindow
const { app, ipcMain, Menu, BrowserWindow } = require('electron')

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: { webSecurity: false },
    width: IS_PROD ? 1200 : 1600,
    height: 800,
  })

  if (IS_PROD) {
    const Server = require('./electron/server')
    mainWindow.loadURL(`file://${__dirname}/dist/index.html?renderer=1`)
  } else {
    mainWindow.loadURL(`http://localhost:7788`)
  }

  if (!IS_PROD) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  var template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit()
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:',
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', createWindow)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
