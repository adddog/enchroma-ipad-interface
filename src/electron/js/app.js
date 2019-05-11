import "whatwg-fetch"
import choo from "choo"
import fastclick from "fastclick"
import html from "choo/html"
import Model from "el:lib/model"
import Api from "el:lib/api"
import { isProd, API_PORT, INT_PORT, EXP_PORT } from "c:/constants"
import AppInit from "c:/app"
import AppStore from "c:/store"

/*************
 *  views
 ************ */
import AppEmitter from "el:lib/emitter"

import indexView from "el:views"

fastclick(document.body)

var app = choo()
AppInit(app)
app.use(Model)
app.use(Api)

const getExpPort = () => (isProd ? API_PORT : EXP_PORT)
const getIntPort = () => (isProd ? API_PORT : INT_PORT)

//class="absolute app w-100 h-100 sans-serif bg-white"
function mainView(state, emitter, prev) {
  const hostname = state.hostname || ""
  return html`
    <main
      class="u-flex u-flex--stack container full-wh p-2"
      onload=${onload}
    >
      <h4>This machine's IP: <mark>${window.IP}</mark></h4>
      <h4>This machine can also be accessed at: <mark>http://${hostname.toLowerCase()}.local</mark></h4>

      <h4 class="p-2 bg-grey bg-rouded">
        the <i>experiment</i> ipad should load
        <mark>http://${window.IP}:${getExpPort()}/exp</mark>or
        <mark>http://${hostname.toLowerCase()}.local:${getExpPort()}/exp</mark>or
        <mark>http://${process.env.NGROK_HTTP}/exp</mark>
      </h4>

      <h4 class="p-2 bg-grey bg-rouded">
        the <i>interface</i> ipad should load
        <mark>http://${window.IP}:${getIntPort()}/int</mark>or
        <mark>http://${hostname.toLowerCase()}.local:${getIntPort()}/int</mark>or
        <mark>http://${process.env.NGROK_HTTP}/int</mark>
      </h4>
      <div class="u-flex u-flex--grow full-wh">
        ${indexView(state, emitter, prev)}
      </div>
    </main>
  `
}
app.route(`*`, mainView)

var tree = app.start()
document.body.appendChild(tree)


window.addEventListener("resize", e => {
  AppEmitter.emit("resize", {
    width: window.innerWidth,
    height: window.innerHeight,
  })
})
