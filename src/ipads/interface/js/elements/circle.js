import { cover, contain } from 'intrinsic-scale'
import Nanocomponent from 'nanocomponent'
import html from 'choo/html'
import { autobind } from 'core-decorators'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import AppStore from 'c:/store'
import { getRGBString } from 'i:lib/drawing-helpers'
import GL from 'i:gl'
import Logic from './circle-logic'

class Component extends Nanocomponent {
  constructor() {
    super()
    AppEmitter.on('resize', this.resize)
  }

  @autobind
  resize() {
    this.el.width = this.parentWidth
    this.el.height = this.parentHeight
    this.logic.draw()
  }

  createElement() {
    this.logic = Logic()
    return html`
        <canvas class="circle-canvas"></canvas>
      `
  }

  get parentWidth(){
    return this.parentNode.offsetWidth
  }

  get parentHeight(){
    return this.parentNode.offsetHeight
  }

  load(el) {
    this.el = el
    this.parentNode = el.parentNode
    if(!this.parentNode) return
    const s =
      Math.min(this.parentWidth, this.parentHeight) -
      CIRCLE_MARGIN
    //this.el.width = s
    //this.el.height = s
    GL.init(this.el)

    AppStore.setValue('canvas:domrect', el.getBoundingClientRect())
    this.logic.init(el, { width: s, height: s })
  }

  update() {
    return false // Never re-render
  }
}
const circle = new Component()

module.exports = (state, emit) => {
  return html`
        <article class="column h-100 interface-col circle-container" style="background-color: ${getRGBString(
          GREY_NEUTRAL,
        )}">
          ${circle.render(state, emit)}
        </article>
      `
}
