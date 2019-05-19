import AppEmitter from 'c:/emitter'
import iPadWSBase from 'pad:/websocket'
import WebsocketHandlers from 'exp:lib/handlers'

class WS extends iPadWSBase {

 onopen() {
  console.log('onopen: experiment')
  this.send('experiment', 'handshake')
 }

 onMessage(socketData) {
  const { type, data } = socketData
  switch (type) {
   case 'interface:touches':
      // WebsocketHandlers.testTouches(data)
    break
  }
 }
}

export default new WS()
