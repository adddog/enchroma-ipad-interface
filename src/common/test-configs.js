import StateMachine from 'c:/state-machine'
import Store from 'c:/store'
import AppEmitter from 'c:/emitter'

export const parseTestConfig = (config, sequence) => {
 var _time = 0
 sequence = sequence || []
 config.forEach(function(testBlock, i) {
  _time += testBlock.STARE_DURATION
  /*
      Testing testObject
      */
  sequence.push({
   ...testBlock,
   stateMachine: StateMachine.INDUCTION,
   endTime: _time,
   leftCircleRGB: testBlock,
   rightCircleRGB: testBlock.BACKGROUND_GREY,
   isMatchingMode: false,
   isInductionMode: true,
  })

  _time += testBlock.MATCH_DURATION
  /*
      Matching testObject
      */
  sequence.push({
   ...testBlock,
   stateMachine: StateMachine.MATCH,
   endTime: _time,
   leftCircleRGB: testBlock.WHITE,
   rightCircleRGB: testBlock.WHITE, // will be overwritten by UserColor
   isMatchingMode: true,
   isInductionMode: false,
  })

  _time += testBlock.RESET_DURATION

  if (testBlock.RESET_DURATION) {
   /*
      RESET
      reset testObject
      */
   sequence.push({
    ...testBlock,
    stateMachine: StateMachine.REST,
    endTime: _time,
    leftCircleRGB: testBlock.BACKGROUND_GREY,
    rightCircleRGB: testBlock.BACKGROUND_GREY,
    isResetingMode: true,
    isMatchingMode: false,
    isInductionMode: false,
   })
  }
 })
 return sequence
}
