import html from "choo/html"
import { isDev } from "c:/constants"
import classnames from "classnames"
import Nanocomponent from "nanocomponent"

class Home extends Nanocomponent {
  createElement(state = {}) {
    return html`
      <div class="p-absolute pos-tl full-wh u-flex--c">
        <p class="p-absolute pos-bl c-white">${window.appId}</p>
        <h1><mark>waiting for a test...</mark></h1>
        <div class="p-absolute pos-tr">
          <div
            class="unicode ${state.websocketConnected
              ? "--connected"
              : "--disconnected"}"
          >
            ⇝
          </div>
          <div
            class="unicode ${state.webrtcConnected
              ? "--connected"
              : "--disconnected"}"
          >
            ⇉
          </div>
          ${isDev
            ? html`
                <textarea id="story" name="story" rows="5" cols="33">
                    ${state.logs}
                  </textarea
                >
              `
            : null}
        </div>
      </div>
    `
  }

  update() {
    return true
  }
}

export default Home
