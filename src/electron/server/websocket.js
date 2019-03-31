const { isObject } = require("lodash")
const parse = require("fast-json-parse")
const WebSocket = require("ws")
const colors = require("colors")

module.exports = function({ port }) {
  const connections = new Map()

  const transformData = data => {
    if (isObject(data)) {
      return JSON.stringify(data)
    } else {
      return data
    }
  }
  const send = (connection, data) =>
    connection.send(transformData(data))

  const hasExperiment = () => connections.has("experiment")
  const getExperiment = () => connections.get("experiment")
  const hasMaster = () => connections.has("master")
  const getMaster = () => connections.get("master")
  const sendExperiment = data =>
    hasExperiment() && send(getExperiment(), data)
  const sendMaster = data => hasMaster() && send(getMaster(), data)

  const hasInterface = () => connections.has("interface")
  const getInterface = () => connections.get("interface")
  const sendInterface = data =>
    hasInterface() && send(getInterface(), data)

  const wss = new WebSocket.Server({
    port: port,
    perMessageDeflate: false,
  })

  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(data) {
      const { value } = parse(data)
      console.log(colors.green(`Got ${value.type}`))
      switch (value.type) {
        case "handshake": {
          ws.id = value.data
          connections.set(value.data, ws)
          console.log("Handshake", value.data)
          break
        }
        case "interface:brightness":
        case "interface:touches":
          {
            sendExperiment(data)
            sendMaster(data)
          }
          break
        case "master:reload":
        case "master:test:set":
        case "master:test:pause":
        case "master:test:update":
        case "master:test:stop": {
          sendExperiment(value)
          sendInterface(value)
          break
        }
      }
    })
  })

  function sendAction(data) {
    switch (data.action) {
      case "refresh": {
        sendExperiment(data)
        sendInterface(data)
        break
      }
      case "setActiveTest": {
        sendExperiment(data)
        sendInterface(data)
        break
      }
    }
  }

  return {
    sendAction,
  }
}
