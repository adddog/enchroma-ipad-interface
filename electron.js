const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true
const IS_PROD = process.env.NODE_ENV !== "development"

let mainWindow
const { app, ipcMain, Menu, BrowserWindow } = require("electron")
const { format } = require("url")

fs.chmodSync(path.join(__dirname, "ngrok"), "755")
const ngrok = spawn(path.join(__dirname, "ngrok"), [
  "start",
  "enchroma",
  `--config`,
  `${path.join(__dirname, "ngrok.yaml")}`,
])

ngrok.stdout.on("data", data => {
  console.log(`child stdout:\n${data}`)
})
ngrok.stdout.on("error", data => {
  console.log(`child stdout:\n${data}`)
})

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: { webSecurity: false },
    width: IS_PROD ? 1200 : 1600,
    height: 800,
  })

  if (IS_PROD) {
    const Server = require("./src/electron/server")
    mainWindow.loadURL(
      format({
        pathname: path.join(
          __dirname,
          "public",
          "electron",
          "index.html"
        ),
        protocol: "file",
        slashes: true,
      })
    )
  } else {
    mainWindow.loadURL(`http://localhost:7788`)
  }

  mainWindow.webContents.openDevTools()
  if (!IS_PROD) {
  }

  mainWindow.on("closed", function() {
    mainWindow = null
  })

  var template = [
    {
      label: "Application",
      submenu: [
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            app.quit()
          },
        },
        {
          label: "Refresh Page",
          accelerator: "CmdOrCtrl+R",
          click() {
            mainWindow.reload()
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:",
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:",
        },
        { type: "separator" },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:",
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:",
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:",
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:",
        },
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on("ready", createWindow)

app.on("before-quit", function() {
  ngrok.kill("SIGINT")
})
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    ngrok.kill("SIGINT")
    app.quit()
  }
})

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow()
  }
})
