import { cover, contain } from 'intrinsic-scale'
import Nanocomponent from 'nanocomponent'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'lib/constants'
import AppEmitter from 'lib/emitter'
import GL from 'gl'
import { getRGBString } from 'lib/drawing-helpers'
import { autobind } from 'core-decorators'
import html from 'choo/html'
import Logic from './circle-logic'
import AppStore from 'lib/store'

class Component extends Nanocomponent {
  constructor() {
    super()
    AppEmitter.on('resize', this.resize)
  }

  @autobind
  resize() {
    this.el.width = this.parentNode.offsetWidth
    this.el.height = this.parentNode.offsetHeight
    this.logic.draw()
  }

  createElement() {
    //this.logic = Logic()
    return html`
        <canvas class="circle-canvas"></canvas>
      `
  }

  load(el) {
    this.el = el
    this.parentNode = el.parentNode
    const s =
      Math.min(this.parentNode.offsetWidth, this.parentNode.offsetHeight) -
      CIRCLE_MARGIN
    this.el.width = s
    this.el.height = s
    GL.init(this.el)

    /*AppStore.setValue('canvas:domrect', el.getBoundingClientRect())
    this.logic.init(el, { width: s, height: s })*/
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
