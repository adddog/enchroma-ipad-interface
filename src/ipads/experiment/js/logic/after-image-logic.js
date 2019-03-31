import { cover, contain } from 'intrinsic-scale'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
import {
 hsv2rgb,
 xy2polar,
 rad2deg,
 getRGBString,
 addTouchEvents,
} from 'i:lib/drawing-helpers'
import AppStore from 'c:/store'
import AppEmitter from 'c:/emitter'

//***********
// SETUP FROM CONFIG.JSON
//***********
let tests = [];
let testNumber = 0;
let activeTest;
let _timeElapsed = performance.now();

let OUTPUT_DATA = [];

//***********
// internal variables
//***********
let ctx
let _paused = false;
let _engine = false;
let _testIndex = 0;
let _testSequence = [];

function resetTest() {
  _testSequence.length = 0;
  _timeElapsed = 0;
  _testIndex = 0;
}

function beginTest() {
  setTestTimings();
  getScreenSize();
  _timeElapsed = 0;
  _paused = false;
}

function completeTest() {
  _paused = true;
  outputItemsEl.style.display = 'block';
}

function pauseTest() {
  _paused = true;
}

//***********
// internal setup function
//***********
function setTestTimings() {
  var _time = 0;

  activeTest.RGB_TEST_VALUES.forEach(function(_, i) {
    _time += activeTest.STARE_DURATION;
    /*
      Testing testObject
      */
    _testSequence.push({
      endTime: _time,
      leftCircleRGB: activeTest.RGB_TEST_VALUES[i],
      leftCircleHSL: rgbToHSL(...activeTest.RGB_TEST_VALUES[i]),
      rightCircleRGB: activeTest.BACKGROUND_GREY,
      isMatchingMode: false,
    });

    _time += activeTest.MATCH_DURATION;
    /*
      Matching testObject
      */
    _testSequence.push({
      endTime: _time,
      leftCircleRGB: activeTest.WHITE,
      rightCircleRGB: activeTest.WHITE, // will be overwritten by UserColor
      isMatchingMode: true,
    });

    _time += activeTest.RESET_DURATION;

    if (activeTest.RESET_DURATION) {
      /*
      RESET
      reset testObject
      */
      _testSequence.push({
        endTime: _time,
        leftCircleRGB: activeTest.BACKGROUND_GREY,
        rightCircleRGB: activeTest.BACKGROUND_GREY,
        isResetingMode: true,
        isMatchingMode: false,
      });
    }
  });
}

module.exports = function() {

 AppEmitter.on('resize', resize)
 AppEmitter.on('render', render)

 function resize(e) {}

 function render(e) {
 }

 function init(el, { width, height }) {
  ctx = el.getContext('2d')
 }
 function start(e) {
  tests = [...res]
  activeTest = tests[testNumber]
  const btns = tests.map((test, i) =>
   createTestButton(test.TEST_NAME),
  )
  btns.forEach((btn, i) =>
   btn.addEventListener('click', function(e) {
    pauseTest()
    testNumber = i
    activeTest = tests[testNumber]
    resetTest()
    beginTest()
   }),
  )
  beginTest()
  _engine.start()
 }
 function stop(e) {}
 function draw() {
  drawCircle(ctx)
 }
 return {
  init,
  start,
  stop,
  draw,
 }
}
