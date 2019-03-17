import AppEmitter from 'c:/emitter'
import AppStore from 'c:/store'

export default {
 testTouches: data => {
  AppStore.setValue('interface:touches', data)
  AppEmitter.emit('store:interface:update')
 },
}
