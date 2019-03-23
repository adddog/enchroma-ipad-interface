import AppEmitter from 'c:/emitter'
import WebSocket from 'el:lib/websocket'
import { getJSON } from 'i:lib/util'
import { getActiveTest, getActiveTestData } from 'el:selectors'
import AfterImageTest from './tests/after-image'

async function loadConfig(state, emitter) {
 return await getJSON('data/tests-config.json')
}

export default async function(state, emitter) {
 const afterImageTest = AfterImageTest()
 const config = await loadConfig(state, emitter)
 state.activeTest = {}
 state.testStarted = false
 state.testsConfigs = config

 emitter.on('el:setActiveTest', id => {
  state.activeTest = Object.assign({}, state.activeTest, {
   id,
   index: 0,
  })
  state.activeTest.data = getActiveTestData(state)
  WebSocket.setActiveTest(getActiveTest(state))
  emitter.emit('render')
 })

 emitter.on('editor:change', data => {
  getActiveTestData(state).parsed = data
 })

 emitter.on('el:test:start', data => {
  afterImageTest.start(getActiveTest(state), {
   onUpdate: data => {
    AppEmitter.emit('ipads:tests:update', data)
   },
  })
  state.testStarted = true
  emitter.emit('render')
 })
 emitter.on('el:test:pause', data => {
  state.testPaused = !state.testPaused
  afterImageTest.pause()
  AppEmitter.emit('ipads:tests:pause', state.testPaused)
  emitter.emit('render')
 })
 emitter.on('el:test:stop', data => {
  afterImageTest.stop()
  state.testStarted = false
  AppEmitter.emit('ipads:tests:stop')
  emitter.emit('render')
 })

 AppEmitter.on('ipads:tests:start', data => {
  state.activeTestBlock = {
   ...data,
   name: data.test.TEST_NAME,
   test: JSON.stringify(data.test, null, 4),
  }
  emitter.emit('render')
 })

 /*AppEmitter.on('ipads:tests:update', data => {
  state.activeTestBlock = {
   ...data,
   name: data.test.TEST_NAME,
   test: JSON.stringify(data.test, null, 4),
  }
  emitter.emit('render')
 })*/

 AppEmitter.on('ipads:tests:stop', data => {})

 emitter.emit('render')
}
