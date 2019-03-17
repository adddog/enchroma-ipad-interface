import 'whatwg-fetch'
import choo from 'choo'
import html from 'choo/html'
import Model from 'exp:lib/model'
import DevModel from 'c:/dev-model'
import AppInit from 'c:/app'
import AppStore from 'c:/store'

/*************
 *  views
 ************ */
import Views from 'exp:views/index'

var app = choo()
AppInit(app)
app.use(Model)
app.use(DevModel)

//class="absolute app w-100 h-100 sans-serif bg-white"
function mainView(state, prev, send) {
  return html`
    <main
      class="absolute app w-100 h-100"
      onload=${onload}
    >
      ${Views(state, prev, send)}
    </main>
  `
}
app.route(`*`, mainView)

var tree = app.start()
document.body.appendChild(tree)
