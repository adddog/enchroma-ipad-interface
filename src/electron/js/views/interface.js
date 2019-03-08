import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { getActiveTest, getActiveTestData } from 'el:selectors'

import { CodeEditor } from 'el:views/code-editor'
import { LiveTest } from 'el:views/live-test'

import API from 'i:/api'
const { setActiveTest, refresh } = API

const renderButton = (data, onclick) =>
 html`
  <button
   class="column col-auto btn mx-1 my-2"
   data-id="${data.id}"
   onclick=${onclick}
   disabled=${!!data.disabled}
  >
   ${data.name}
  </button>
 `

const editorView = new CodeEditor()
module.exports = (state, emit) => {
 const activeTest = getActiveTest(state)
 return html`
  <article
   class="p-relative u-flex u-flex--stack u-flex--start container bg-grey--light p-2 full-h"
  >
   <h3>${activeTest.name}</h3>
   <div class="u-flex u-flex--start full-wh">
    <div class="u-flex u-flex--stack">
     ${renderButton(
      { name: 'Start', id: 'start', disabled: state.testStarted },
      evt => emit('el:test:start', evt.target.dataset.id),
     )}
     ${renderButton(
      {
       name: html`
        <span class="${state.testPaused ? 'text-gray' : ''}"
         >pause</span
        >/<span class="${!state.testPaused ? 'text-gray' : ''}"
         >resume</span
        >
       `,
       id: 'pause',
       disabled: !state.testStarted,
      },
      evt => emit('el:test:pause', evt.target.dataset.id),
     )}
     ${renderButton(
      { name: 'Stop', id: 'stop', disabled: !state.testStarted },
      evt => emit('el:test:stop', evt.target.dataset.id),
     )}
    </div>
    <div class="u-flex full-wh">
     ${!state.testStarted
      ? editorView.render(getActiveTestData(state).phases, emit)
      : null}
     ${LiveTest(state)}
    </div>
   </div>
  </article>
 `
}
