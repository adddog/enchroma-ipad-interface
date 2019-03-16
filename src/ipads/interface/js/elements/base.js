import html from 'choo/html'
import AppStore from 'c:/store'
import BaseComponent from 'c:/elements/component'

export class ConnectedBaseComponent extends BaseComponent {
 onStoreTestUpdate(testBlock) {}

 load(el) {
  AppStore.on('store:test:update', () => {
   const testBlock = AppStore.getValue('test:update')
   this.onStoreTestUpdate(testBlock)
  })
 }
}
