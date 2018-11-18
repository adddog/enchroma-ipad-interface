import AppEmitter from 'lib/emitter'
class Store {
 constructor() {
  this.store = new Map([['brightness', 0]])
  AppEmitter.on('slider:brightnes', v => this.store.set('brightness', v))
 }

 setValue(key, value) {
  this.store.set(key, value)
 }

 getValue(key) {
  return this.store.get(key)
 }
}

export default new Store()
