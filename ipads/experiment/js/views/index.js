import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { GREY_NEUTRAL } from 'c:/constants'
import AppStore from 'c:/store'
import AfterImage from 'exp:views/after-image'

const renderInterface = (state, emit) => {
 switch (AppStore.store.get('testName')) {
  case 'after-image':
   return html`
    ${AfterImage(state, emit)}
   `
  default:
   return html`
    <p class="p-absolute pos-tl c-white">experiment</p>
    <h1><mark>waiting for a test...</mark></h1>
   `
 }
}
module.exports = (state, emit) => {
 return html`
  <article class="w-100 h-100 black-80 columns interface-view flex-c">
   ${renderInterface(state, emit)}
  </article>
 `
}
