import AppEmitter from 'c:/emitter'
import { isDev,isDevTest, ASSET_PATH } from 'c:/constants'
import { getJSON } from 'i:lib/util'
import {
 getActiveTestData,
 getActiveTestBlock,
 getActiveTestIndex,
} from 'i:selectors'
import { parseTestConfig } from 'c:/test-configs'
import WebsocketHandlers from 'i:lib/websocket/handlers'

async function loadConfig(state, emitter) {
 return await getJSON(`${ASSET_PATH}/example-config.json`)
}

export default async function(state, emitter) {
  console.log('isDevTest', isDevTest);
 if (!isDev || !isDevTest) {
  return
 }
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
 //WebsocketHandlers.testSet(state.activeTest.data.phases)
 emitter.emit('render')

 /* **************
  *  DEVELOPMENT
  ************** */
 AppEmitter.on('dev:tests:update', data => {
  state.activeTest = Object.assign({}, state.activeTest, data)
  WebsocketHandlers.testUpdate({
   ...state.activeTest,
   test: getActiveTestBlock(state),
  })
  emitter.emit('render')
 })
}
