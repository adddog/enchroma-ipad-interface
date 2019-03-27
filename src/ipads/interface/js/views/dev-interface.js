import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { getRGBString } from 'c:/util'
import AppEmitter from 'c:/emitter'
import { getRGBFromInterfacePayload } from 'c:/selector'
import AppStore from 'c:/store'
import { isDev, GREY_NEUTRAL } from 'c:/constants'
import renderButton from 'c:/elements/button'
import WebsocketHandlers from 'i:lib/websocket/handlers'
import {
 getActiveTestId,
 getActiveTestIndex,
 getActiveTestBlock,
} from 'i:selectors'

class Color extends Nanocomponent {
 createElement() {
  return html`
   <div class="b-btn live-test-color"></div>
  `
 }

 load(el) {
  this.el = el
  AppStore.on('interface:touches', payload => {
   const [red, green, blue] = getRGBFromInterfacePayload(payload)
   this.el.style.backgroundColor = getRGBString(
    Math.floor(red),
    Math.floor(green),
    Math.floor(blue),
   )
  })
 }

 update() {
  return false
 }
}
const color = new Color()

export default (state, emit) => {
 const activeTestId = getActiveTestId(state)
 const activeTestBlock = getActiveTestBlock(state)
 if (!activeTestBlock) return
 switch (activeTestId) {
  case 'after-image':
   return html`
    <p class="p-absolute pos-tl u-flex u-flex--stack">
      <span class="text-secondary">test name:<mark>${activeTestBlock.TEST_NAME}</mark></span>
      <span class="text-secondary">test state:<mark>${activeTestBlock.stateMachine}</mark></span>
     ${renderButton({ text: 'Next', id: 'next' }, evt => {
      evt.preventDefault()
      AppEmitter.emit('dev:tests:update', {
       index: getActiveTestIndex(state) + 1,
      })
     })}
     ${color.render({ key: 'interface:touches' })}
    </p>
   `
  default:
   return html`
    <p class="p-absolute pos-tl c-white">interface</p>
   `
 }
}
