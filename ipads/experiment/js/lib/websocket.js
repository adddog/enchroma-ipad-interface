import { isProd } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import WSBase from 'c:/websocket'
import safeStringify from 'fast-safe-stringify'

class WS extends WSBase {
 init() {
  super.init()

  this.client.onmessage = function(event) {
   let data
   try {
    data = JSON.parse(event.data)
   } catch (e) {
    console.log(e)
   }
   switch (data.action) {
    case 'refresh':
     window.location.reload()
     break
    case 'setActiveTest':
     AppEmitter.emit('setActiveTest', data.data)
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

 onopen(){
  this.send('experiment', 'handshake')
 }
}

export default new WS()
