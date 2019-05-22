import AppEmitter from "c:/emitter"
import DateAndTime from "date-and-time"
import {
  downloadJson,
  downloadCSVFromJSON,
  importFile,
} from "c:/util"
import { isMatch } from "c:/state-machine"
import WebSocket from "el:lib/websocket"
import { getJSON } from "i:lib/util"
import {
  hasInterfaceTouches,
  getInterfaceTouches,
  getRGBFromInterfacePayload,
} from "c:/selector"
import {
  getTestResultsOnly,
  getActiveTest,
  getActiveTestData,
  getActiveTestBlockData,
} from "el:selectors"
import AfterImageTest from "./tests/after-image"

async function loadConfig(state) {
  const data = window.getInStore("test-config")
  if (data) {
    return Promise.resolve(JSON.parse(data))
  }
  return await getJSON("data/tests-config.json")
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
  let [red, green, blue] = getRGBFromInterfacePayload(
    getInterfaceTouches()
  )
  red = Math.floor(red)
  blue = Math.floor(blue)
  green = Math.floor(green)
  console.log(getActiveTestBlockData(state))
  const colors = { red, green, blue }
  const test = getActiveTestBlockData(state)
  state.testResult.push({
    test,
    result: {
      name: test.TEST_NAME,
      matchDuration: test.MATCH_DURATION,
      testRGB: test.RGB_TEST_VALUES.join(" "),
      ...colors,
    },
  })
}

export default async function(state, emitter) {
  const afterImageTest = AfterImageTest()
  const config = await loadConfig(state)
  console.log(config)
  window.setInStore("test-config", JSON.stringify(config))
  //window.deleteInStore("test-config")
  state.activeTest = {}
  state.hostname = ""
  state.activeTestBlock = null
  state.testStarted = false
  state.testsConfigs = config
  state.testResult = []

  //debugger;

  function onTestUpdate(data) {
    createTestResult(state)
    state.activeTestBlock = data
    AppEmitter.emit("ipads:tests:update", data)
    emitter.emit("render")
  }

  function onTestComplete(data) {
    state.testPaused = true
    state.testComplete = true
    AppEmitter.emit("ipads:tests:complete")
    emitter.emit("render")
  }

  emitter.on("el:setActiveTest", id => {
    state.activeTest = Object.assign({}, state.activeTest, {
      id,
      index: 0,
    })
    state.activeTest.data = getActiveTestData(state)
    WebSocket.setActiveTest(getActiveTest(state))
    emitter.emit("render")
  })

  emitter.on("editor:change", data => {
    getActiveTestData(state).parsed = data
    console.log(state.testsConfigs)
    const saveTests = {
      ...state.testsConfigs,
    }
    saveTests[getActiveTest(state).id].data.phases = data
    console.log(saveTests)
    window.setInStore("test-config", JSON.stringify(saveTests))
  })

  /* ************
   *  BUTTONS
   ************ */

  emitter.on("el:test:start", data => {
    afterImageTest.start(getActiveTest(state), {
      onUpdate: onTestUpdate,
      onComplete: onTestComplete,
    })
    state.testStarted = true
    emitter.emit("render")
  })

  emitter.on("el:test:pause", data => {
    state.testPaused = !state.testPaused
    afterImageTest.pause()
    AppEmitter.emit("ipads:tests:pause", state.testPaused)
    emitter.emit("render")
  })

  emitter.on("el:test:stop", data => {
    afterImageTest.stop()
    AppEmitter.emit("ipads:tests:stop")
    emitter.emit("render")
  })

  emitter.on("el:reload", data => {
    state.testStarted = false
    afterImageTest.stop()
    AppEmitter.emit("ipads:reload")
    location.reload()
  })

  AppEmitter.on("ipads:tests:start", data => {
    emitter.emit("render")
  })

  /*AppEmitter.on('ipads:tests:update', data => {
  state.activeTestBlock = {
   ...data,
   name: data.test.TEST_NAME,
   test: JSON.stringify(data.test, null, 4),
  }
  emitter.emit('render')
 })*/

  AppEmitter.on("ipads:tests:stop", data => {})

  /* ************
   *  config
   ************ */
  emitter.on("el:config:export", data => {
    downloadJson(data, "after-image-config")
  })
  emitter.on("el:config:import", data => {
    importFile().then(file => {
      var fr = new FileReader()
      fr.onload = function(e) {
        state.activeTest.data.phases = JSON.parse(e.target.result)
        emitter.emit("render")
      }
      fr.readAsText(file)
    })
  })
  /* ************
   *  results
   ************ */
  emitter.on("el:results:export", () => {
    downloadCSVFromJSON(
      getTestResultsOnly(state),
      `results-${DateAndTime.format(new Date(), `YYYY/MM/DD HH:mm`)}`
    )
  })

  window.getHostname(hostname => {
    state.hostname = hostname
    emitter.emit("render")
  })
}
