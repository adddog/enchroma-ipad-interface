const { ipcRenderer } = require("electron")
const incstr = require("incstr")
const listDirectories = require("list-directories")
const DateAndTime = require("date-and-time")
const mkdirp = require("mkdirp")
const { join, parse } = require("path")
const util = require("util")
const mkdir = util.promisify(require("fs").mkdir)
const exists = util.promisify(require("fs").exists)
const writeFile = util.promisify(require("fs").writeFile)
var { listFiles } = require("list-files-in-dir")
const rimraf = util.promisify(require("rimraf"))
function listFiles(dir, ext) {
  return new Promise(yes => {
    listFiles(dir, ext).then(files => {
      yes(files)
    })
  })
}

window.ipc = window.ipc || {}
const nextId = incstr.idGenerator("0")

window.ipc.updateTest = (saveName, data) => {
  exists(join(window.ipc.saveDir, saveName)).then(x => {
    console.log("xxxxxx")
    console.log(x)
    const { name, dir, ext } = parse(saveName)
    if (x) {
      saveName = `${name}_${nextId()}${ext}`
    }
  })
  writeFile(join(window.ipc.saveDir, saveName), data)
}

async function mkdirP(p) {
  return new Promise((yes, no) => {
    mkdirp(p, function(err) {
      if (err) no(err)
      else yes(p)
    })
  })
}

async function init(saveDir, mainDir) {
  window.ipc.saveDir = saveDir
  const dirs = await listDirectories(mainDir)
  await Promise.all(
    Array.from(dirs).map(async p => {
      const files = await listFiles(p)
      if (!files || !files.length) {
        await rimraf(p)
      }
    })
  )
  console.log(saveDir)
  const x = await exists(saveDir)
  if (!x) {
    await mkdirP(saveDir)
  }
}

ipcRenderer.send("on-loaded", true)
ipcRenderer.on("docs", (event, arg) => {
  init(
    join(
      arg,
      "Enchrona Test App",
      DateAndTime.format(new Date(), `YYYY-MM-DD-HH_mm`)
    ),
    join(arg, "Enchrona Test App")
  )
})
ipc.messaging = {}
