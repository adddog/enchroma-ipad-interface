import 'whatwg-fetch'
import choo from 'choo'
import AppEmitter from 'c:/emitter'
import html from 'choo/html'
import Model from 'i:lib/model'
import DevModel from 'i:lib/dev-model'
import AppInit from 'c:/app'
import AppStore from 'c:/store'
/*************
 *  views
 ************ */
import interfaceView from 'i:views/interface'

var app = choo()
AppInit(app)
app.use(Model)
app.use(DevModel)

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
