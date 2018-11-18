import regl from 'regl'
import AppEmitter from 'lib/emitter'
import HueWheel from './hueWheel'
class GL {
 init(canvas) {
  this.regl = regl(canvas)
  this.hueWheel = HueWheel(this.regl)
  this.hueWheel()
 }
}

export default new GL()
