import html from "choo/html"
import classnames from "classnames"
import Nanocomponent from "nanocomponent"

class Home extends Nanocomponent {
  createElement(state = {}) {
    return html`
      <div class="p-absolute pos-tl full-wh u-flex--c">
        <p class="p-absolute pos-bl c-white">${window.appId}</p>
        <h1><mark>waiting for a test...</mark></h1>
        <div
          class="p-absolute pos-tr unicode ${state.websocketConnected
            ? "--connected"
            : "--disconnected"}"
        >
          ⏺
        </div>
      </div>
    `
  }

  update() {
    return true
  }
}

export default Home
