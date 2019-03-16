import Nanocomponent from 'nanocomponent'
import { autobind } from 'core-decorators'
import html from 'choo/html'
import AppEmitter from 'c:/emitter'

export default class BaseComponent extends Nanocomponent {
 constructor(args) {
  super(args)
  AppEmitter.on('resize', this.resize)
 }

 @autobind
 resize(res) {
 }

 unload(){
  AppEmitter.off('resize', this.resize)
 }
}
