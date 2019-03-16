import html from 'choo/html'

export default (data, onclick) =>
 html`
  <button
   class="btn ${data.class}"
   data-id="${data.id}"
   onclick=${onclick}
   disabled=${!!data.disabled}
  >
   ${data.text}
  </button>
 `
