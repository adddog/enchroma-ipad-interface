import Nanocomponent from 'nanocomponent'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'lib/constants'
import AppEmitter from 'lib/emitter'
import { autobind } from 'core-decorators'
import html from 'choo/html'

import { map } from 'lodash'
import { prefix } from 'inline-style-prefixer'

const style = {
  transform: 'rotate(90deg) translateY(100%)',
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
    this.slider.addEventListener('input', e => {
      console.log(e.target.value)
    })

    const output = prefix({
      position: 'absolute',
      transform: 'rotate(90deg)',
      width: `${el.parentNode.offsetHeight - CIRCLE_MARGIN}px`,
      left: `${el.parentNode.offsetWidth / 2}px`,
      top:0
    })

    map(output, (val, key) => {
      this.slider.style[key] = val
    })

    this.slider = el
    this.slider.addEventListener('input', e => {
      AppEmitter.emit('slider:brightnes', parseFloat(e.target.value))
    })
  }

  update() {
    return false // Never re-render
  }
}
const slider = new Component()

module.exports = (state, emit) => {
  return html`
        <article class="column col-2 interface-col">
          ${slider.render(state, emit)}
        </article>
      `
}
