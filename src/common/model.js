import Store from 'c:/store'
import AppEmitter from 'c:/emitter'

export default (state, emitter) => {
 AppEmitter.on('websocket:connected', val => {
  Store.setValue('websocket:connected', val)
 })
}
