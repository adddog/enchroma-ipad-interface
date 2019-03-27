import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { isDev, GREY_NEUTRAL } from 'c:/constants'
import renderButton from 'c:/elements/button'
import WebsocketHandlers from 'i:lib/websocket/handlers'
import { getRGBString } from 'i:lib/drawing-helpers'
import { getActiveTestId } from 'i:selectors'
import AppStore from 'c:/store'
import { Controls } from 'i:elements/controls'

import renderDevInterface from './dev-interface'

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
   ${renderInterface(state, emit)} ${renderDevInterface(state, emit)}
  </article>
 `
}
