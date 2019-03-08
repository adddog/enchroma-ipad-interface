import html from 'choo/html'
import classnames from 'classnames'
import AppEmitter from 'c:/emitter'
import { getRGBString } from 'c:/util'
import { autobind } from 'core-decorators'
import {
 isDev,
 RGB_GREY_NEUTRAL,
 RGB_GREY_NEUTRAL_DARK,
 RGB_GREY_NEUTRAL_LIGHTEST,
 CIRCLE_MARGIN,
} from 'c:/constants'
import AppStore from 'c:/store'
import { getRes, getHeight, getWidth } from 'c:/selector'
import { isInduction, isMatch, isRest } from 'c:/state-machine'
import { getActiveTest } from 'i:selectors'
import Nanocomponent from 'nanocomponent'
import Two from 'two.js'
import CodeMirror from 'codemirror'
import Logic from './circle-logic'

const renderOverlay = testBlock => {
 if (!testBlock) return null
 if (isInduction(testBlock) || isRest(testBlock)) {
  return html`
   <div class="bg-overlay">
    <h1><mark>please hold...</mark></h1>
   </div>
  `
 }
 if (isMatch(testBlock)) {
  return null
 }
}

class Overlay extends Nanocomponent {
 createElement(config = {}) {
  this.config = config
  const { test } = this.config
  return html`
   <div
    class="${classnames([
     'p-absolute',
     'full-wh',
     'controls-overlay',
     { '--inactive': !isMatch(test) },
    ])}"
   >
    ${renderOverlay(test)}
   </div>
  `
 }

 load(el) {
  this.el = el
  const activeTest = getActiveTest(this.config)
  AppStore.on('update', () => {
   const testBlock = AppStore.getValue('test:update')
   this.render(testBlock)
  })
 }

 update() {
  return true
 }
}

const overlay = new Overlay()

class Controls extends Nanocomponent {
 createElement(config, emit) {
  AppEmitter.on('resize', this.resize)
  if (isDev) {
   AppEmitter.on('touches', this.drawTouchColor)
  }
  AppStore.on('test:update', () => {
   const testBlock = AppStore.getValue('test:update')
   console.log(testBlock);
   this.logic.setPreviousXY(testBlock.previousXY)
   if (testBlock && testBlock.test) {
    this.logic.pause(!isMatch(testBlock.test))
   }

   if (isDev) {
    this.addPreviousXY(testBlock)
   }
  })
  this.config = config
  this.emit = emit
  return html`
   <div class="full-wh">
    ${overlay.render(config)}
   </div>
  `
 }

 @autobind
 resize(res) {
  this.logic.resize(res)
 }

 get diameter() {
  return (
   Math.min(this.el.offsetWidth, this.el.offsetHeight) - CIRCLE_MARGIN
  )
 }

 drawCircle() {
  this.circle = this.two.makeCircle(
   getWidth() / 2,
   getHeight() / 2,
   this.diameter / 2,
  )
  this.circle.fill = RGB_GREY_NEUTRAL
  this.circle.stroke = RGB_GREY_NEUTRAL_DARK
  this.circle.linewidth = 3

  this.drawDot()
  this.two.update()
 }

 drawDot(color = RGB_GREY_NEUTRAL_LIGHTEST) {
  this.dot = this.two.makeCircle(getWidth() / 2, getHeight() / 2, 4)
  this.dot.fill = color
  this.dot.stroke = color
  this.dot.linewidth = 0
 }

 @autobind
 addPreviousXY(testBlock) {
  console.log(testBlock)
  console.log(
   testBlock.previousXY[0] * this.diameter,
   testBlock.previousXY[1] * this.diameter,
  )
  const p = this.two.makeCircle(
   getWidth() / 2 + testBlock.previousXY[0] * this.diameter,
   getHeight() / 2 + testBlock.previousXY[1] * this.diameter,
   9,
  )
  p.fill = 'red'
  p.stroke = 'red'
  p.linewidth = 0
  this.two.update()
 }

 @autobind
 drawTouchColor(arr) {
  if (!this.touchCircle) {
   this.touchCircle = this.two.makeCircle(arr[5], arr[6], 9)
   this.touchCircle.fill = 'red'
   this.touchCircle.stroke = 'red'
   this.touchCircle.linewidth = 0
  } else {
   this.touchCircle.fill = getRGBString(
    Math.floor(arr[2] * 255),
    Math.floor(arr[3] * 255),
    Math.floor(arr[4] * 255),
   )
   this.touchCircle.translation.set(arr[5] - 20, arr[6] - 20)
  }
  this.two.update()
 }

 load(el) {
  this.el = el
  AppStore.setValue('canvas:domrect', el.getBoundingClientRect())

  var params = {
   type: Two.Types.canvas,
   ...getRes(),
  }
  this.two = new Two(params).appendTo(el)
  this.drawCircle()

  this.logic = Logic()
  this.logic.init(el, {
   width: this.diameter,
   height: this.diameter,
  })
 }

 update() {
  return false
 }
}

exports.Controls = Controls
