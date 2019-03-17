import WebSocket from 'exp:lib/websocket'
import AppEmitter from 'c:/emitter'
import { postJSON } from 'c:/util'

export default (state, emitter) => {
  AppEmitter.on('render', () => emitter.emit('render'))
}
