import AppEmitter from 'c:/emitter'
import { downloadJson, importFile } from 'c:/util'
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

async function loadConfig(state) {
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
 const config = await loadConfig(state)
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

 /* ************
 *  BUTTONS
 ************ */

 emitter.on('el:test:start', data => {
  afterImageTest.start(getActiveTest(state), {
   onUpdate: onTestUpdate,
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
  AppEmitter.emit('ipads:tests:stop')
  emitter.emit('render')
 })

 emitter.on('el:reload', data => {
  state.testStarted = false
  afterImageTest.stop()
  AppEmitter.emit('ipads:reload')
  location.reload()
 })

 AppEmitter.on('ipads:tests:start', data => {
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

 /* ************
  *  config
  ************ */
 emitter.on('el:config:export', data => {
  downloadJson(data)
 })
 emitter.on('el:config:import', data => {
  importFile().then(file => {
   var fr = new FileReader()
   fr.onload = function(e) {
    state.activeTest.data = JSON.parse(e.target.result)
    emitter.emit('render')
   }
   fr.readAsText(file)
  })
 })

 emitter.emit('render')
}
