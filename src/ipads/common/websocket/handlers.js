import AppEmitter from 'c:/emitter'
import AppStore from 'c:/store'

export default {
 testSet: data => {
  AppStore.setValue('test:set', data)
  AppEmitter.emit('test:set', data)
 },
 testPause: data => {
  AppStore.setValue('test:pause', data)
  AppEmitter.emit('test:pause', data)
  AppStore.testUpdate()
 },
 testStop: data => {
  AppStore.setValue('test:stop', data)
  AppEmitter.emit('test:stop', data)
  AppStore.testUpdate()
 },
 testUpdate: data => {
  AppStore.setValue('test:update', data.test)
  AppEmitter.emit('test:update', data)
  AppStore.testUpdate()
 },
}
