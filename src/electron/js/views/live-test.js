import AppStore from 'c:/store'
import { getRGBString } from 'c:/util'
import { getRGBFromInterfacePayload } from 'c:/selector'
import Nanocomponent from 'nanocomponent'
import html from 'choo/html'

const renderInterface = (state, emit) => {
 AppStore.on('update', () => {})
 return html`
  <p class="p-absolute pos-tl c-white">interface</p>
  <h1><mark>waiting for a test...</mark></h1>
 `
}
class Color extends Nanocomponent {
 createElement(config, emit) {
  this.config = config
  this.emit = emit
  return html`
   <div class="live-test-color"></div>
  `
 }

 load(el) {
  this.el = el
  AppStore.on('update', () => {
   const [ red, green, blue] = getRGBFromInterfacePayload()
   this.el.style.backgroundColor = getRGBString(
    Math.floor(red * 255),
    Math.floor(green * 255),
    Math.floor(blue * 255),
   )
  })
 }

 update() {
  return false
 }
}

const color = new Color()
exports.LiveTest = state => {
 return !!state.activeTestBlock && state.testStarted
  ? html`
     <div class="u-flex u-flex--stack  full-wh">
      <div class="u-flex u-flex--start">
       <span><i>test phase:</i></span>
       <p class="no-marg">${state.activeTestBlock.name}</p>
      </div>
      <div class="u-flex u-flex--start full-wh">
       <textarea class="code-editor full-h w-50">
            ${state.activeTestBlock.test}
        </textarea
       >
       <div class="u-flex u-flex--start u-flex--stack full-wh">
        <span><i>color:</i></span
        >${color.render({ key: 'interface:touches' })}
       </div>
      </div>
     </div>
    `
  : null
}
