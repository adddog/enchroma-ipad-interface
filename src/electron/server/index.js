const path = require("path")
const http = require("http")
const express = require("express")
const cors = require("cors")
var bodyParser = require("body-parser")
console.log(path.join(process.cwd(), ".env"))
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env.prod"),
})
const PORT = process.env.API_PORT || 3000
const WS_PORT = process.env.WS_PORT || 3333

const app = express()
app.use(cors()) // for parsing application/json
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const publicDir = path.join(__dirname, "../../../", "/public")
app.use(express.static(publicDir))

app.get("/", (request, reply) => {
  reply.sendFile(path.join(publicDir, "electron/index.html"))
})

app.get("/int", (request, reply) => {
  reply.sendFile(path.join(publicDir, "interface/index.html"))
})

app.get("/exp", (request, reply) => {
  reply.sendFile(path.join(publicDir, "experiment/index.html"))
})

app.post("/api", (req, reply) => {
  const { body } = req
  switch (body.action) {
    case "refresh":
    case "setActiveTest":
      WS.sendAction(body)
      break
  }
})

const server = http.createServer(app).listen(PORT)

const WS = require("./websocket")({ server })
