import { isProd } from 'c:/constants'
import { getXYFromInterfacePayload } from 'c:/selector'
import AppStore from 'c:/store'
import AppEmitter from 'c:/emitter'
import parse from 'fast-json-parse'
import WSBase from 'c:/websocket'
import safeStringify from 'fast-safe-stringify'

class WS extends WSBase {
 init() {
  super.init()

  this.client.onmessage = function(event) {
   let socketData
   try {
    socketData = parse(event.data)
   } catch (e) {
    console.error(e)
    return
   }
   if (socketData.err) return
   const { type, data } = socketData.value
   switch (type) {
    case 'interface:touches': {
     AppStore.setValue('interface:touches', data)
     AppStore.update()
     break
    }
   }
  }

  AppEmitter.on('ipads:tests:start', data => {
   data.previousXY = getXYFromInterfacePayload()
   this.send(data, 'master:test:update')
  })

  AppEmitter.on('ipads:tests:update', data => {
   this.send(data, 'master:test:update')
  })

  AppEmitter.on('ipads:tests:pause', value => {
   this.send(value, 'master:test:pause')
  })

  AppEmitter.on('ipads:tests:stop', data => {
   this.send(data, 'master:test:stop')
  })
 }

 onopen() {
  this.send('master', 'handshake')
 }

 setActiveTest(config) {
  this.send(config, 'master:test:set')
 }
}

export default new WS()
