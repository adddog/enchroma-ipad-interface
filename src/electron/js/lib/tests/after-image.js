import AppEmitter from 'c:/emitter'
import StateMachine from 'c:/state-machine'
import { noop } from 'lodash'
import loop from 'raf-loop'

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
   index: 0,
  })
 resetState()
 //***********
 // internal setup function
 //***********
 function setTestTimings() {
  var _time = 0
  state.activeTest.data.phases.forEach(function(testBlock, i) {
   _time += testBlock.STARE_DURATION
   /*
      Testing testObject
      */
   state.sequence.push({
    ...testBlock,
    stateMachine: StateMachine.INDUCTION,
    endTime: _time,
    leftCircleRGB: testBlock,
    rightCircleRGB: testBlock.BACKGROUND_GREY,
    isMatchingMode: false,
   })

   _time += testBlock.MATCH_DURATION
   /*
      Matching testObject
      */
   state.sequence.push({
    ...testBlock,
    stateMachine: StateMachine.MATCH,
    endTime: _time,
    leftCircleRGB: testBlock.WHITE,
    rightCircleRGB: testBlock.WHITE, // will be overwritten by UserColor
    isMatchingMode: true,
   })

   _time += testBlock.RESET_DURATION

   if (testBlock.RESET_DURATION) {
    /*
      RESET
      reset testObject
      */
    state.sequence.push({
     ...testBlock,
     stateMachine: StateMachine.REST,
     endTime: _time,
     leftCircleRGB: testBlock.BACKGROUND_GREY,
     rightCircleRGB: testBlock.BACKGROUND_GREY,
     isResetingMode: true,
     isMatchingMode: false,
    })
   }
  })
 }

 function drawCanvas(delta) {
  var now = performance.now()

  if (state.paused) return

  //pick the testObject out
  var testObject = state.sequence[state.index]
  //short hand access
  var isMatchingMode = testObject.isMatchingMode
  var isResetingMode = testObject.isResetingMode

  timeElapsed += delta
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
  }
 }

 function start(config, options = { onUpdate: noop }) {
  if (state.started) return
  state.onUpdate = options.onUpdate
  state.activeTest = config
  setTestTimings()
  state.engine = loop(drawCanvas).start()
  state.started = true
  AppEmitter.emit('ipads:tests:start', {
   test: state.sequence[state.index],
   index: state.index,
   totalPhases: state.sequence.length,
  })
 }
 function pause(argument) {
  state.paused = !state.paused
 }
 function stop(argument) {
  state.engine.stop()
  state.started = false
  setTestTimings()
  resetState()
 }
 return {
  start,
  pause,
  stop,
 }
}
