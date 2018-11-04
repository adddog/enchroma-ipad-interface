const html = require('choo/html')

module.exports = (sites, emit) => {
  return html`
        <article class="pa4 black-80">
        <div class="ph3">
            <h1 class="f6 fw6 ttu tracked">controls</h1>
            <button onclick=${e=> emit('controls:stream:start')} class="f6 link dim br-pill ph3 pv2 mb2 dib white bg-black" href="#0">start live stream</button>
            <button onclick=${e=> emit('controls:stream:stop')} class="f6 link dim br-pill ph3 pv2 mb2 dib white bg-near-black" href="#0">stop live stream</button>
          </div>
      </article>

      `
}
