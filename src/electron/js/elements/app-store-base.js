import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { GREY_NEUTRAL } from 'c:/constants'
import { getRGBString } from 'i:lib/drawing-helpers'
import { getActiveTestName } from 'i:selectors'
import AppStore from 'c:/store'
import Circle from 'i:elements/circle'
import { Controls } from 'i:elements/controls'
import Slider from 'i:elements/slider'

const renderInterface = (state, emit) => {
 AppStore.on('render', () => {

 })
 return html`
  <p class="p-absolute pos-tl c-white">interface</p>
  <h1><mark>waiting for a test...</mark></h1>
 `
}

module.exports = (state, emit) => {
 return html`
  <article class="">
   ${renderInterface(state, emit)}
  </article>
 `
}
