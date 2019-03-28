import AppEmitter from 'c:/emitter'
import iPadWSBase from 'pad:/websocket'

class WS extends iPadWSBase {
 init() {
  super.init()
  AppEmitter.on('interface:touches', coords => {
   this.send(coords, 'interface:touches')
  })
 }
 onopen() {
  console.log('onopen: interface')
  this.send('interface', 'handshake')
 }
}

export default new WS()
