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
   const { type, data } = socketData
   switch (type) {
    case 'refresh':
     window.location.reload()
     break
    case 'interface:touches':
     WebsocketHandlers.testTouches(data)
     break
   }
  }
 }

 onopen() {
  this.send('experiment', 'handshake')
 }
}

export default new WS()
