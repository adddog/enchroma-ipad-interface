import AppEmitter from 'c:/emitter'
import { getJSON } from 'i:lib/util'
import { getActiveTestData, getActiveTestBlock } from 'i:selectors'
import { parseTestConfig } from 'c:/test-configs'
import WebsocketHandlers from 'i:lib/websocket/handlers'

async function loadConfig(state, emitter) {
 return await getJSON('example-config.json')
}

export default async function(state, emitter) {
 const config = await loadConfig(state, emitter)
 state.testsConfigs = config
 state.activeTest = {
  id: 'after-image',
  index: 0,
  data: state.testsConfigs['after-image'].data,
 }
 state.activeTest.data.phases = parseTestConfig(
  getActiveTestData(state).phases,
 )
 WebsocketHandlers.testSet(state.activeTest.data.phases)
 emitter.emit('render')

 AppEmitter.on('dev:tests:update', data => {
  state.activeTest = Object.assign({}, state.activeTest, data)
  WebsocketHandlers.testUpdate({
   test: getActiveTestBlock(state),
  })
  emitter.emit('render')
 })
}
