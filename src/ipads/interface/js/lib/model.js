import WebSocket from 'i:lib/websocket'
import { getActiveTestData } from 'i:selectors'
import { parseTestConfig } from 'c:/test-configs'
import AppEmitter from 'c:/emitter'

export default async function(state, emitter) {
 AppEmitter.on('test:set', data => {
  state.activeTest = data
  state.activeTest.data.phases = parseTestConfig(getActiveTestData(state).phases)
  emitter.emit('render')
 })

 AppEmitter.on('test:update', data => {
  state.activeTest.index = data.index
  emitter.emit('render')
 })

 AppEmitter.on('render', () => emitter.emit('render'))
 emitter.emit('render')
}
