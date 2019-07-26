import html from "choo/html"
import classnames from "classnames"
import { ConnectedBaseComponent } from "pad:/views/base"
import { getIsPaused, getIsWaiting } from "../selectors"

const getText = state => {
  if (getIsPaused(state)) {
    return "paused"
  }
  if (getIsWaiting(state)) {
    return null
  }
  return null
}
const renderOverlay = state => {
  if (!state) return null
  const text = getText(state)
  if (!text) return null
  return html`
    <div class="p-absolute full-wh u-flex u-flex--center z-1">
      <h1><mark>${text}</mark></h1>
    </div>
  `
}

class Overlay extends ConnectedBaseComponent {
  createElement(state = {}) {
    return html`
      <div
        class="${classnames([
          "p-absolute",
          "full-wh",
          "controls-overlay",
          { "--inactive": getIsPaused(state) || getIsWaiting(state) },
        ])}"
      >
        ${renderOverlay(state)}
      </div>
    `
  }

  onStoreTestUpdate(state) {
    this.render(state)
  }

  update() {
    return true
  }
}
const overlay = new Overlay()

export default Overlay
