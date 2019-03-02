import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { getTestConfigs } from 'el:selectors'

/*
 */

const renderButtons = (state, onclick) =>
 getTestConfigs(state).map(
  test =>
   html`
    <button
     class="column col-auto btn mx-1"
     data-id="${test.id}"
     onclick=${onclick}
    >
     ${test.name}
    </button>
   `,
 )

module.exports = (state, emit) => {
 return html`
  <article class="container bg-grey--light p-2">
   <h3>Tests Library</h3>
   <div class="columns">
    ${renderButtons(state, evt =>
     emit('el:setActiveTest', evt.target.dataset.id),
    )}
   </div>
  </article>
 `
}
