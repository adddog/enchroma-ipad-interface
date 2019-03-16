import { isProd } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import WSBase from 'c:/websocket'
import safeStringify from 'fast-safe-stringify'
import WebsocketHandlers from './handlers'

class WS extends WSBase {
 init() {
  super.init()

  this.client.onmessage = function(event) {
   let socketData
   try {
    socketData = JSON.parse(event.data)
   } catch (e) {
    console.error(e)
    return
   }
   console.log(socketData)
   const { type, data } = socketData
   switch (type) {
    case 'refresh':
     window.location.reload()
     break
    case 'master:test:set':
     WebsocketHandlers.testSet(data)
     break
    case 'master:test:pause':
     WebsocketHandlers.testPause(data)
     break
    case 'master:test:stop':
     WebsocketHandlers.testStop(data)
     break
    case 'master:test:update':
     WebsocketHandlers.testUpdate(data)
     break
   }
  }

  AppEmitter.on('interface:touches', coords => {
   this.send(coords, 'interface:touches')
  })

  AppEmitter.on('slider:brightness', brightness => {
   this.send(brightness, 'interface:brightness')
  })
 }
 onopen() {
  this.send('interface', 'handshake')
 }
}

export default new WS()
