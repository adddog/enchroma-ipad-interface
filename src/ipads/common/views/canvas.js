import { cover, contain } from 'intrinsic-scale'
import Nanocomponent from 'nanocomponent'
import html from 'choo/html'
import { autobind } from 'core-decorators'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import AppStore from 'c:/store'
import { getRGBString } from 'i:lib/drawing-helpers'
import GL from 'i:gl'
import Logic from './circle-logic'

export default class Component extends Nanocomponent {
  constructor(props) {
    super()
    this.props = props
    AppEmitter.on('resize', this.resize)
  }

  @autobind
  resize() {
    this.el.width = this.parentWidth
    this.el.height = this.parentHeight
  }

  createElement() {
    return html`
        <canvas></canvas>
      `
  }

  get parentWidth(){
    return this.parentNode.offsetWidth
  }

  get parentHeight(){
    return this.parentNode.offsetHeight
  }

  load(el) {
    this.el = el
    this.parentNode = el.parentNode
    if(this.props){
      this.props.onLoad(this.el)
    }
    if(!this.parentNode) return
    const s =
      Math.min(this.parentWidth, this.parentHeight) -
      CIRCLE_MARGIN
    AppStore.setValue('canvas:domrect', el.getBoundingClientRect())
  }

  update() {
    return false // Never re-render
  }
}
