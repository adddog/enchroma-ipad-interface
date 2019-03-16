import WebSocket from 'i:lib/websocket'
import AppEmitter from 'c:/emitter'

export default async function(state, emitter) {

 AppEmitter.on('test:set', data => {
  state.activeTest.data = data
  emitter.emit('render')
 })

 AppEmitter.on('render', () => emitter.emit('render'))
 emitter.emit('render')
}
