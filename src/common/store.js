import AppEmitter from 'c:/emitter'

class Store {
 constructor() {
  this.store = new Map([
   ['testName', null],
   ['brightness', 0],
   ['res', { width: window.innerWidth, height: window.innerHeight }],
  ])
  AppEmitter.on('interface:brightness', v => {
   this.setValue('brightness', v)
   this.render()
  })
  AppEmitter.on('setActiveTest', v => {
   this.setValue('testName', v)
   this.render()
  })
 }

 on(event, cb) {
  AppEmitter.on(event, cb)
 }

 setValue(key, value) {
  this.store.set(key, value)
 }

 getValue(key) {
  return this.store.get(key)
 }

 render() {
  AppEmitter.emit('render')
 }

 update() {
  AppEmitter.emit('update')
 }

 testUpdate() {
  AppEmitter.emit('test:update')
 }
}

export default new Store()
