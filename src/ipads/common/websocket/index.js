import safeParse from "safe-json-parse/callback"
import { isProd } from "c:/constants"
import AppEmitter from "c:/emitter"
import WSBase from "c:/websocket"
import safeStringify from "fast-safe-stringify"
import WebsocketHandlers from "pad:/websocket/handlers"

class WS extends WSBase {
  init() {
    super.init()

    const _self = this

    this.client.onmessage = function(event) {
      /* safeParse(event.data, (err, data) => {
    console.log(err)
    console.log(data)
   })
   return*/
      let socketData
      if (typeof event.data === "string") {
        try {
          socketData = JSON.parse(event.data)
        } catch (e) {
          console.error(e)
        }
      } else {
        socketData = event.data
      }
      if (!socketData) return
      const { type, data } = socketData
      switch (type) {
        case "master:handshake":
          console.log(type, data)
          break
        case "master:reload":
          window.location.reload()
          break
        case "master:test:set":
          console.log(type, data)
          WebsocketHandlers.testSet(data)
          break
        case "master:test:pause":
          console.log(type, data)
          WebsocketHandlers.testPause(data)
          break
        case "master:test:stop":
          console.log(type, data)
          WebsocketHandlers.testStop(data)
          break
        case "master:test:update":
          console.log(type, data)
          WebsocketHandlers.testUpdate(data)
          break
      }
      _self.onMessage(socketData)
    }
  }
}

export default WS
