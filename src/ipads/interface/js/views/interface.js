import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { GREY_NEUTRAL } from 'c:/constants'
import { getRGBString } from 'i:lib/drawing-helpers'
import { getActiveTestId } from 'i:selectors'
import AppStore from 'c:/store'
import Circle from 'i:elements/circle'
import {Controls} from 'i:elements/controls'
import Slider from 'i:elements/slider'

const controlsView = new Controls()

const renderInterface = (state, emit) => {
 const activeTestId = getActiveTestId(state)
 switch (activeTestId) {
  case 'after-image':
   return html`
    ${controlsView.render(state, emit)}
   `
  default:
   return html`
    <p class="p-absolute pos-tl c-white">interface</p>
    <h1><mark>waiting for a test...</mark></h1>
   `
 }
}

module.exports = (state, emit) => {
 return html`
  <article
   class="w-100 h-100 black-80 columns interface-view flex-c"
   style="background-color: ${getRGBString(GREY_NEUTRAL)}"
  >
   ${renderInterface(state, emit)}
  </article>
 `
}
