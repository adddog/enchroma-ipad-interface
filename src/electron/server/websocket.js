const { isObject } = require("lodash")
const parse = require("fast-json-parse")
const WebSocket = require("ws")
const colors = require("colors")

module.exports = function({ server, port }) {
  const connections = new Map()

  const transformData = data => {
    if (isObject(data)) {
      return JSON.stringify(data)
    } else {
      return data
    }
  }
  const send = (connection, data = {}) => {
    connection.readyState === 1 &&
      connection.send(transformData(data))
  }

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

  console.log("WebSocket port: ", port)
  const wss = new WebSocket.Server({
    port,
    perMessageDeflate: false,
  })

  wss.on("connection", function connection(ws) {

    onConnection(ws)

    ws.on("message", function incoming(data) {
      const { value } = parse(data)
      console.log(colors.green(`Got ${value.type}`))
      switch (value.type) {
        case "handshake": {
          console.log("Handshake", value.data)
          ws.id = value.data
          connections.set(value.data, ws)
          send(ws, {
            type: "master:handshake",
            data: { id: ws.id, readyState: ws.readyState },
          })
          break
        }
        case "ping": {
          send(ws, {
            type: "pong",
          })
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

  var peersWaiting = Object.create(null)
  var clientConnections = Object.create(null)

  function closeConnection(pairCode, filter) {
    if (!filter) {
      // Create a no-op function.
      filter = x => x
    }
    let matched = false
    clientConnections[pairCode].forEach(conn => {
      matched = filter(conn)
      if (matched) {
        conn.peer = null
      }
    })
    if (matched) {
      clientConnections[pairCode] = null
    }
  }

  function sendMessage(type, data) {
    this.send(
      JSON.stringify({
        type: type,
        data: data,
      })
    )
  }

  function onConnection(client) {
    client.sendMessage = sendMessage.bind(client)

    client.on("message", msg => {
      console.log("[message] Received message: %s", msg)

      var obj = JSON.parse(msg)
      client.emit("message." + obj.type, obj.data)
    })

    client.on("message.data", data => {
      console.log("[pair] Received data:", data)

      if (client.peer) {
        client.peer.sendMessage("data", data)
      }
    })

    client.on("message.pair", pairCode => {
      console.log("[pair] Received pairCode:", pairCode)

      if (clientConnections[pairCode]) {
        client.sendMessage("warning", {
          message: '`pairCode` "' + pairCode + '" is already in use',
          pairCode: pairCode,
        })
        closeConnection(pairCode, function(clientToCheck) {
          return clientToCheck !== client
        })
      }

      client.pairCode = pairCode

      var waiting = peersWaiting[pairCode]

      if (waiting && waiting !== client) {
        console.log("[pair] Other peer found")

        client.peer = waiting
        waiting.peer = client
        clientConnections[pairCode] = [client, waiting]
        peersWaiting[pairCode] = null
        waiting.sendMessage("peer.found", { initiator: false })
        client.sendMessage("peer.found", { initiator: true })
      } else {
        console.log("[pair] No other peer found")
        // I am waiting for you.
        peersWaiting[pairCode] = client
      }
    })

    client.on("message.rtc.signal", data => {
      console.log("[rtc.signal] Signal recieved")

      if (client.peer) {
        client.peer.sendMessage("rtc.signal", data)
      } else {
        console.warn("[rtc.signal] Signal with no peer!")
      }
    })

    client.on("message.rtc.connect", () => {
      console.log("[rtc.connect] Received")

      if (client.peer) {
        client.peer.sendMessage("rtc.connect")
      }
    })

    client.on("close", () => {
      const pairCode = client.pairCode
      if (
        pairCode in peersWaiting &&
        peersWaiting[pairCode] === client
      ) {
        peersWaiting[pairCode] = null
      }

      if (client.peer) {
        peersWaiting[pairCode] = client.peer
        closeConnection(pairCode)
      }
    })
  }

  return {
    sendAction,
  }
}
