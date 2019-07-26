const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true
const IS_PROD = process.env.NODE_ENV !== "development"
const dotenv = require("dotenv").config({
  path: path.join(__dirname, IS_PROD ? ".env.prod" : ".env"),
})

let mainWindow
const { app, ipcMain, Menu, BrowserWindow } = require("electron")
const { format } = require("url")

let ngrok
console.log("process.env.NGROK ", process.env.NGROK)
if (process.env.NGROK == "true") {
  try{
    fs.chmodSync(path.join(__dirname, "ngrok"), "755")
  }catch(e){

  }
  const ngorkCmd = [
    "start",
    "enchroma",
    "enchromawss",
    `--config`,
    `${path.join(__dirname, "ngrok.yaml")}`,
  ]
  console.log(ngorkCmd.join(" "))
  ngrok = spawn(path.join(__dirname, "ngrok"), ngorkCmd)

  ngrok.stdout.on("data", data => {
    console.log(`child stdout:\n${data}`)
  })
  ngrok.stdout.on("error", data => {
    console.log(`child stdout:\n${data}`)
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: { webSecurity: false },
    width: IS_PROD ? 1200 : 1600,
    height: 800,
  })

  ipcMain.on("on-loaded", (event, arg) => {
    event.sender.send("docs", app.getPath("documents"))
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

  if (!IS_PROD) {
    mainWindow.webContents.openDevTools()
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
  if (ngrok) {
    ngrok.kill("SIGINT")
  }
})
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    if (ngrok) {
      ngrok.kill("SIGINT")
    }
    app.quit()
  }
})

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow()
  }
})
