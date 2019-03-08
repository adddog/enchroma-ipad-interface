import regl from 'regl'
import AppEmitter from 'c:/emitter'
import HueWheel from './hueWheel'
class GL {
  constructor() {
    this.props = { baseColor: [0.5, 0.5, 0.5], brightness: 1.0 }
  }
  init(canvas) {
    AppEmitter.on('slider:brightness', v => {
      this.props.brightness = v
      this.draw()
    })
    this.regl = regl(canvas)
    this.hueWheel = HueWheel(this.regl)
    this.draw()
  }

  draw(props = this.props) {
    this.hueWheel(props)
  }
}

export default new GL()
