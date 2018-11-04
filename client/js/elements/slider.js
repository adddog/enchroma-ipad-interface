import Nanocomponent from 'nanocomponent'
import AppEmitter from 'lib/emitter'
import { autobind } from 'core-decorators'
import html from 'choo/html'

class Component extends Nanocomponent {
  constructor() {
    super()
  }

  createElement() {
    return html`
        <input class="slider is-fullwidth" step="0.00001" min="0" max="100" value="50" type="range">
      `
  }

  load(el) {
    this.slider = el
    console.log(this.slider)
    this.slider.addEventListener('input', e => {
      console.log(e.target.value)
    })
  }

  update() {
    return false // Never re-render
  }
}
const slider = new Component()

module.exports = (state, emit) => {
  return html`
        <article class="w-20 h-100">
          ${slider.render(state, emit)}
        </article>
      `
}
