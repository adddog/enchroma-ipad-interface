import Nanocomponent from 'nanocomponent'
import AppEmitter from 'lib/emitter'
import { autobind } from 'core-decorators'
import html from 'choo/html'
import Logic from './circle-logic'

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
    this.logic = Logic()
    return html`
        <canvas class="w-100 h-100"></canvas>
      `
  }

  load(el) {
    this.el = el
    this.parentNode = el.parentNode
    this.el.width = this.parentNode.offsetWidth
    this.el.height = this.parentNode.offsetHeight
    this.logic.init(el)
  }

  update() {
    return false // Never re-render
  }
}
const circle = new Component()

module.exports = (state, emit) => {
  return html`
        <article class="w-80 h-100">
          ${circle.render(state, emit)}
        </article>
      `
}
