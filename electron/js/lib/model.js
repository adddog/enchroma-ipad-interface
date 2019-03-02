import AppEmitter from 'c:/emitter'
import WebSocket from 'el:lib/websocket'
import { getJSON } from 'i:lib/util'
import { getActiveTest } from 'el:selectors'
import AfterImageTest from './tests/after-image'

async function loadConfig(state, emitter) {
 return await getJSON('data/tests-config.json')
}

export default async function(state, emitter) {
 const afterImageTest = AfterImageTest()
 const config = await loadConfig(state, emitter)
 state.activeTest = null
 state.testStarted = false
 state.testsConfigs = config

 emitter.on('el:setActiveTest', data => {
  state.activeTest = data
  emitter.emit('render')
  WebSocket.setActiveTest(getActiveTest(state))
 })

 emitter.on('editor:change', data => {
  state.testsConfigs[state.activeTest].data.parsed = data
 })

 emitter.on('el:test:start', data => {
  afterImageTest.start(state.testsConfigs[state.activeTest])
  state.testStarted = true
  emitter.emit('render')
 })
 emitter.on('el:test:pause', data => {
  afterImageTest.pause()
 })
 emitter.on('el:test:stop', data => {
  afterImageTest.stop()
  state.testStarted = false
 })

 AppEmitter.on('ipads:tests:start', data => {
  state.activeTestBlock = {
   ...data,
   name:data.test.TEST_NAME,
   test: JSON.stringify(data.test, null, 4),
  }
  emitter.emit('render')
 })

 AppEmitter.on('ipads:tests:update', data => {
  state.activeTestBlock = {
   ...data,
   name:data.test.TEST_NAME,
   test: JSON.stringify(data.test, null, 4),
  }
  emitter.emit('render')
 })

 AppEmitter.on('ipads:tests:stop', data => {})

 emitter.emit('render')
}
