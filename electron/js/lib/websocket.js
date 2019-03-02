import { isProd } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import WSBase from 'c:/websocket'
import safeStringify from 'fast-safe-stringify'

class WS extends WSBase {
 init() {
  super.init()

  this.client.onmessage = function(event) {}

  AppEmitter.on('ipads:tests:start', data => {
   this.send(data, 'master:test:start')
  })

  AppEmitter.on('ipads:tests:update', data => {
   // this.send('master:test:update', data)
   //this.send(data)
  })

  AppEmitter.on('ipads:tests:stop', data => {})
 }

 onopen() {
  this.send('master', 'handshake')
 }

 setActiveTest(config) {
  this.send(config, 'master:test:set')
 }
}

export default new WS()
