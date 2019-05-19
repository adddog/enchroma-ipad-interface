import { getActiveTestData } from "i:selectors"
import { parseTestConfig } from "c:/test-configs"

import AppEmitter from "c:/emitter"

export default async function(state, emitter) {
  state.websocketConnected = false
  AppEmitter.on("test:set", data => {
    state.paused = false
    state.waiting = true
    state.activeTest = data
    state.activeTest.data.phases = parseTestConfig(
      getActiveTestData(state).phases
    )
    emitter.emit("render")
  })

  AppEmitter.on("test:stop", data => {
    state.activeTest = null
    emitter.emit("render")
  })

  AppEmitter.on("test:pause", data => {
    state.paused = data
    emitter.emit("render")
  })

  AppEmitter.on("test:update", data => {
    if (state.activeTest) {
      state.waiting = false
      state.activeTest.index = data.index
      emitter.emit("render")
    }
  })

  AppEmitter.on("websocket:connected", () => {
    state.websocketConnected = true
    emitter.emit("render")
  })
  AppEmitter.on("websocket:disconnected", () => {
    state.websocketConnected = false
    emitter.emit("render")
  })

  AppEmitter.on("render", () => emitter.emit("render"))
  emitter.emit("render")
}
