import AppEmitter from "c:/emitter"
import StateMachine from "c:/state-machine"
import { parseTestConfig } from "c:/test-configs"
import { getActiveTestData } from "el:selectors"
import { noop } from "lodash"
import loop from "raf-loop"

export default function() {
  let timeElapsed = 0
  let state = {}
  const resetState = () =>
    (state = {
      engine: null,
      activeTest: null,
      sequence: [],
      started: false,
      paused: false,
      beeps: [false, false, false],
      index: 0,
    })
  resetState()
  //***********
  // internal setup function
  //***********
  function setTestTimings({ activeTest }) {
    return parseTestConfig(activeTest.data.phases, state.sequence)
  }

  function emitBeep(timeElapsed, target, index) {
    if (timeElapsed >= target && !state.beeps[index]) {
      state.beeps[index] = true
      AppEmitter.emit("el:tests:beep")
    }
  }

  function drawCanvas(delta) {
    var now = performance.now()

    if (state.paused) return

    //pick the testObject out
    var testObject = state.sequence[state.index]
    //short hand access
    var isInductionMode = testObject.isInductionMode
    var isMatchingMode = testObject.isMatchingMode
    var isResetingMode = testObject.isResetingMode
    timeElapsed += delta
    // RESET
    if (isInductionMode && timeElapsed > testObject.endTime - 100) {
      state.beeps = [false, false, false]
    }
    if (isMatchingMode && timeElapsed > testObject.endTime - 4000) {
      emitBeep(timeElapsed, testObject.endTime - 3000, 0)
      emitBeep(timeElapsed, testObject.endTime - 2000, 1)
      emitBeep(timeElapsed, testObject.endTime - 1000, 2)
    }
    if (
      timeElapsed > testObject.endTime &&
      state.index < state.sequence.length - 1
    ) {
      //write the data out
      state.onUpdate({
        test: state.sequence[state.index + 1],
        index: state.index + 1,
        totalPhases: state.sequence.length,
      })

      state.index++
    } else if (state.index === state.sequence.length - 1) {
      state.onComplete({})
    }
  }

  function start(
    config,
    options = { onComplete: noop, onUpdate: noop }
  ) {
    if (state.started) return
    state.onUpdate = options.onUpdate
    state.onComplete = options.onComplete
    state.activeTest = config
    setTestTimings(state)
    state.engine = loop(drawCanvas).start()
    state.started = true
    AppEmitter.emit("ipads:tests:start", {
      test: state.sequence[state.index],
      index: state.index,
      totalPhases: state.sequence.length,
    })
  }
  function pause(argument) {
    state.paused = !state.paused
  }
  function stop(argument) {
    if (state.engine) {
      state.engine.stop()
      state.started = false
      setTestTimings(state)
      resetState()
    }
  }
  return {
    start,
    pause,
    stop,
  }
}
