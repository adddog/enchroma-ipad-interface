/* ************
*  NO USE
************ */
import Nanocomponent from 'nanocomponent'
import { autobind } from 'core-decorators'
import html from 'choo/html'
import { map } from 'lodash'
import { prefix } from 'inline-style-prefixer'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
import AppStore from 'c:/store'
import AppEmitter from 'c:/emitter'
import { qs } from 'i:lib/util'

import AfterImageLogic from 'exp:logic/after-image-logic'

const style = {
 transform: 'rotate(90deg) translateY(100%)',
}

class Component extends Nanocomponent {
 constructor() {
  super()
  this.afterImageLogic = AfterImageLogic()
  AppEmitter.on('resize', obj => this.setSize(obj))
 }

 createElement() {
  return html`
   <div class="h-100 interface-col flex-c">
    <canvas></canvas>
    <h1 class="p-absolute"><mark>After Image</mark></h1>
   </div>
  `
 }

 setSize({ width, height }) {
  this.canvas.width = width
  this.canvas.height = height
 }

 load(el) {
  this.el = el
  this.canvas = qs('canvas', this.el)
  this.setSize(AppStore.store.get('res'))
  const width =
   Math.min(this.el.offsetWidth, this.el.offsetHeight) - CIRCLE_MARGIN
   console.log(this.canvas);
  this.afterImageLogic.init(this.canvas, { width })
  this.afterImageLogic.draw()
 }

 update() {
  return false // Never re-render
 }
}
const canvas = new Component()

module.exports = (state, emit) => {
 return html`
  <article class="h-100 w-100">
   ${canvas.render(state, emit)}
  </article>
 `
}
