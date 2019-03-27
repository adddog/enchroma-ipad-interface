import { map } from 'lodash'
import AppStore from 'c:/store'
import { getRGBString } from 'c:/util'
import { getRGBFromInterfacePayload } from 'c:/selector'
import {
 getTestResults,
 getActiveTestBlockData,
 getActiveTestBlockDataToString,
} from 'el:selectors'
import Nanocomponent from 'nanocomponent'
import html from 'choo/html'

const renderInterface = (state, emit) => {
 AppStore.on('update', () => {})
 return html`
  <p class="p-absolute pos-tl c-white">interface</p>
  <h1><mark>waiting for a test...</mark></h1>
 `
}

const renderTestResultBlock = block => {
 if (!block.result) return null
 return html`
  <div class="u-flex">
   <div>
    ${map(block.result, (val, key) => {
     return html`
      <div class="info">
       <span><i>${key}:</i></span>
       <span>${val}</span>
      </div>
     `
    })}
   </div>
   <div
    class="circle-sm"
    style="
    background-color:${getRGBString(
     Math.floor(block.result.red),
     Math.floor(block.result.green),
     Math.floor(block.result.blue),
    )}"
   ></div>
  </div>
 `
}
const renderTestBlock = block => {
 return html`
  <div class="card">
   <div class="label">
    <span><i>test name:</i></span>
    <span class="no-marg">${block.test.TEST_NAME}</span>
   </div>
   ${renderTestResultBlock(block)}
  </div>
 `
}

class TestBlockResults extends Nanocomponent {
 createElement(state) {
  this.state = state
  console.log(getTestResults(state))
  return html`
   <div class="full-wh">
    ${getTestResults(state).map(block => renderTestBlock(block))} >
   </div>
  `
 }

 load(el) {
  this.el = el
  AppStore.on('update', () => {})
 }

 update(state) {
  return true
 }
}
const resultsComp = new TestBlockResults()

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
   const [red, green, blue] = getRGBFromInterfacePayload()
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

exports.LiveTest = state => {
 const testBlock = getActiveTestBlockData(state)
 const testBlockString = getActiveTestBlockDataToString(state)
 return !!testBlock
  ? html`
     <div class="u-flex full-wh">
      <div class="u-flex u-flex--stack u-flex--start full-h w-50">
       <div class="label">
        <span><i>test phase:</i></span>
        <span class="no-marg">${testBlock.TEST_NAME}</span>
       </div>
       <textarea class="code-editor full-wh ">
            ${testBlockString}
        </textarea
       >
      </div>
      <div class="u-flex u-flex--stack u-flex--start full-h w-50">
       ${color.render()}
       <span><i>results:</i></span>
       ${resultsComp.render(state)}
      </div>
     </div>
    `
  : null
}
