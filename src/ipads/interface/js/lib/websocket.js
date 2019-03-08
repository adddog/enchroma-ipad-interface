import { isProd } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import AppStore from 'c:/store'
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
   console.log(socketData)
   const { type, data } = socketData
   switch (type) {
    case 'refresh':
     window.location.reload()
     break
    case 'master:test:set':
     {
      AppStore.setValue('test:set', data)
      AppEmitter.emit('test:set', data)
     }
     break
    case 'master:test:pause': {
     AppStore.setValue('test:pause', data)
      AppStore.testUpdate()
     break
    }
    case 'master:test:stop':
     {
      AppStore.setValue('test:stop', data)
      AppStore.testUpdate()
     }
     break
    case 'master:test:update':
     {
      AppStore.setValue('test:update', data)
      AppStore.testUpdate()
     }
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
