import AppEmitter from 'c:/emitter'
import { isMatch } from 'c:/state-machine'
import WebSocket from 'el:lib/websocket'
import { getJSON } from 'i:lib/util'
import {
 hasInterfaceTouches,
 getInterfaceTouches,
 getRGBFromInterfacePayload,
} from 'c:/selector'
import {
 getActiveTest,
 getActiveTestData,
 getActiveTestBlockData,
} from 'el:selectors'
import AfterImageTest from './tests/after-image'

async function loadConfig(state, emitter) {
 return await getJSON('data/tests-config.json')
}

const createTestResult = state => {
 if (!isMatch(getActiveTestBlockData(state))) {
  return
 }
 if (!hasInterfaceTouches()) {
  state.testResult.push({
   test: { ...getActiveTestBlockData(state) },
  })
  return
 }
 const [red, green, blue] = getRGBFromInterfacePayload(
  getInterfaceTouches(),
 )
 const colors = { red, green, blue }
 state.testResult.push({
  test: getActiveTestBlockData(state),
  result: {
   ...colors,
  },
 })
}

export default async function(state, emitter) {
 const afterImageTest = AfterImageTest()
 const config = await loadConfig(state, emitter)
 state.activeTest = {}
 state.activeTestBlock = null
 state.testStarted = false
 state.testsConfigs = config
 state.testResult = []

 function onTestUpdate(data) {
  createTestResult(state)
  state.activeTestBlock = data
  AppEmitter.emit('ipads:tests:update', data)
  emitter.emit('render')
 }

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
   onUpdate: onTestUpdate,
  })
  //state.activeTestBlock = getActiveTestBlockData(state)
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
  // state.activeTestBlock = data
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
