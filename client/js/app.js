import 'whatwg-fetch'
import choo from 'choo'
import fastclick from 'fastclick'
import html from 'choo/html'
import log from 'choo-log'
import Model from './model'

/*************
 *  views
 ************ */
import interfaceView from 'views/interface'
import AppEmitter from 'lib/emitter'

fastclick(document.body)

const isProd = process.env.NODE_ENV === 'production'
var app = choo()

if (!isProd) {
  function logger(state, emitter) {
    emitter.on('*', function(messageName, data) {
      console.log('event', messageName, data)
    })
  }
  app.use(log())
  app.use(logger)
}

app.use(Model)

function mainView(state, prev, send) {
  return html`
    <main
      class="absolute app w-100 h-100 sans-serif bg-white"
      onload=${onload}
    >
      ${interfaceView(state, prev, send)}
    </main>
  `
}
app.route(`*`, mainView)

var tree = app.start()
document.body.appendChild(tree)

window.addEventListener('resize', e => {
  AppEmitter.emit('resize', {
    width: window.innerWidth,
    height: window.innerHeight,
  })
})
