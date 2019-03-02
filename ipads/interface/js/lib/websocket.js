import { isProd } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import WSBase from 'c:/websocket'
import safeStringify from 'fast-safe-stringify'

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
    case 'master:test:set':
     {
      AppEmitter.emit('master:test:set', data)
     }
     break
    case 'master:test:start':
     break
   }
  }

  AppEmitter.on('touches', coords => {
   this.send(coords, 'interface:circle')
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
