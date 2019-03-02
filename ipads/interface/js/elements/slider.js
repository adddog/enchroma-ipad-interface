import Nanocomponent from 'nanocomponent'
import { autobind } from 'core-decorators'
import html from 'choo/html'
import { map } from 'lodash'
import { prefix } from 'inline-style-prefixer'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
import AppEmitter from 'c:/emitter'

const style = {
  transform: 'rotate(-90deg) translateY(100%)',
}

class Component extends Nanocomponent {
  constructor() {
    super()
  }

  createElement() {
    return html`
        <input class="slider is-fullwidth rotate-90" step="0.00001" min="0" max="100" value="50" type="range">
      `
  }

  load(el) {
    this.slider = el

    const output = prefix({
      position: 'absolute',
      margin: 0,
      transform: 'rotate(90deg)',
      width: `${el.parentNode.offsetHeight - CIRCLE_MARGIN}px`,
      left: `${el.parentNode.offsetWidth / 2}px`,
      top: `${CIRCLE_MARGIN / 2}px`
    })

    map(output, (val, key) => {
      this.slider.style[key] = val
    })

    this.slider = el
    this.slider.addEventListener('input', e => {
      AppEmitter.emit('slider:brightness', 1 - parseFloat(e.target.value) / 100)
    })
  }

  update() {
    return false // Never re-render
  }
}
const slider = new Component()

module.exports = (state, emit) => {
  return html`
        <article class="column h-100 col-2 interface-col">
          ${slider.render(state, emit)}
        </article>
      `
}
