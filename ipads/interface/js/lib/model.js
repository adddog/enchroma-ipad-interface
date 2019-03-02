import WebSocket from 'i:lib/websocket'
import AppEmitter from 'c:/emitter'
import { postJSON } from 'i:lib/util'

export default (state, emitter) => {
 emitter.emit('render')

 AppEmitter.on('test:set', data => {
  state.activeTest = data
  emitter.emit('render')
 })

 AppEmitter.on('render', () => emitter.emit('render'))
}
