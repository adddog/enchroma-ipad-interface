import 'whatwg-fetch'
import choo from 'choo'
import AppEmitter from 'c:/emitter'
import html from 'choo/html'
import DevModel from 'c:/dev-model'
import AppInit from 'c:/app'
import AppStore from 'c:/store'
import Websocket from 'i:lib/websocket'
import WebRTC from "pad:/webrtc"
/*************
 *  views
 ************ */
import interfaceView from 'i:views/interface'

var app = choo()
AppInit(app)
app.use(DevModel)

const webrtc = new WebRTC()

function mainView(state, prev, send) {
 return html`
  <main class="absolute app w-100 h-100" onload=${onload}>
   ${interfaceView(state, prev, send)}
  </main>
 `
}
app.route(`*`, mainView)

var tree = app.start()
document.body.appendChild(tree)
