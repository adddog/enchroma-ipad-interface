import { cover, contain } from 'intrinsic-scale'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'lib/constants'
import {
  hsv2rgb,
  xy2polar,
  rad2deg,
  getRGBString,
  addTouchEvents,
  touchesToPolar,
} from 'lib/drawing-helpers'
import AppStore from 'lib/store'
import AppEmitter from 'lib/emitter'

function drawCircle(ctx, radius, options) {
  let image = ctx.createImageData(2 * radius, 2 * radius)
  let data = image.data
  for (let x = -radius; x < radius; x++) {
    for (let y = -radius; y < radius; y++) {
      let [r, phi] = xy2polar(x, y)
      let deg = rad2deg(phi)
      // Figure out the starting index of this pixel in the image data array.
      let rowLength = 2 * radius
      let adjustedX = x + radius // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
      let adjustedY = y + radius // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
      let pixelWidth = 4 // each pixel requires 4 slots in the data array
      let index = (adjustedX + adjustedY * rowLength) * pixelWidth

      if (r > radius) {
        // skip all (x,y) coordinates that are outside of the circle
        data[index] = GREY_NEUTRAL
        data[index + 1] = GREY_NEUTRAL
        data[index + 2] = GREY_NEUTRAL
        data[index + 3] = 255
        continue
      }

      let hue = deg
      let saturation = r / radius + AppStore.getValue('brightness')
      let value = 1.0

      let [red, green, blue] = hsv2rgb(hue, saturation, value)
      let alpha = 255

      data[index] = red
      data[index + 1] = green
      data[index + 2] = blue
      data[index + 3] = alpha
    }
  }

  ctx.putImageData(image, 0, 0)
}

function calculateTouchPoint(evt) {
  const domRect = AppStore.getValue('canvas:domrect')
  const { clientX, clientY } = evt.touches[0]
  const xPos = (clientX - domRect.x) / domRect.width - 0.5
  const yPos = (clientY - domRect.y) / domRect.height - 0.5
  let [r, phi] = xy2polar(xPos, yPos)
  let deg = rad2deg(phi)
  console.log(deg, r)
}

module.exports = function() {
  let ctx, _width

  AppEmitter.on('slider:brightnes', v => drawCircle(ctx, _width / 2))
  AppEmitter.on('resize', resize)

  function resize(e) {}

  function init(el, { width, height }) {
    _width = width
    ctx = el.getContext('2d')
    ctx.fillStyle = getRGBString(GREY_NEUTRAL)
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    drawCircle(ctx, width / 2)
    addTouchEvents(el, {
      move: calculateTouchPoint,
      start: e => {
        console.log(e)
      },
    })
  }
  function draw() {
    drawCircle(ctx, _width / 2)
    /* ctx.fillStyle = getRGBString(GREY_NEUTRAL)
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    const s = Math.min(el.width, el.height)
    let { width, height, x, y } = contain(el.width, el.height, s, s)
    drawCircle(ctx, width / 2 - CIRCLE_MARGIN)*/
  }
  return {
    init,
    draw,
  }
}
