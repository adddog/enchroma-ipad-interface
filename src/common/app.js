import AppEmitter from 'c:/emitter'
import fastclick from 'fastclick'
import devtools from 'choo-devtools'

import CommonModel from 'c:/model'
import AppModel from 'pad:/models'

export default app => {
 fastclick(document.body)

 const isProd = process.env.NODE_ENV === 'production'

 if (!isProd) {
  function logger(state, emitter) {
   emitter.on('*', function(messageName, data) {})
  }
  app.use(devtools())
  app.use(logger)
 }

 app.use(CommonModel)
 app.use(AppModel)



 window.addEventListener('resize', e => {
  AppEmitter.emit('resize', {
   width: window.innerWidth,
   height: window.innerHeight,
  })
 })

}
