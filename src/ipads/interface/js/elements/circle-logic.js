import { cover, contain } from 'intrinsic-scale'
import { GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
import {
 hsv2rgb,
 xy2polar,
 rad2deg,
 getRGBString,
 addTouchEvents,
} from 'i:lib/drawing-helpers'
import AppStore from 'c:/store'
import AppEmitter from 'c:/emitter'

const HALF_PI = Math.PI / 2
const touchesPayload = Math.PI * 2

module.exports = function() {
 let ctx,
  _width,
  _height,
  _paused,
  _previousXY = [0, 0],
  _pos = {
   startX: 0,
   startY: 0,
  }

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
    let saturation =
     r / radius + AppStore.store.getValue('brightness')
    let value = 1.0

    let [red, green, blue] = hsv2rgb(hue, saturation, value, true)
    let alpha = 255

    data[index] = red
    data[index + 1] = green
    data[index + 2] = blue
    data[index + 3] = alpha
   }
  }

  ctx.putImageData(image, 0, 0)
 }

 const touchesPayload = new Array(7)

 const getNormalizedXY = evt => {
  const domRect = AppStore.getValue('canvas:domrect')
  const { clientX, clientY } = evt.touches[0]
  const xPos = (clientX - domRect.x) / domRect.width - 0.5
  const yPos = (clientY - domRect.y) / domRect.height - 0.5
  return { x: xPos, y: yPos }
 }

 const updatePosOnDragXY = evt => {
  const { x, y } = getNormalizedXY(evt)
  _pos.x = _pos.startX + (x - _pos.startX)
  _pos.y = _pos.startY + (y - _pos.startY)
  return _pos
 }

 function calculateTouchPointStart(evt) {
  const { x, y } = getNormalizedXY(evt)
  _pos.startX = x
  _pos.startY = y
  return _pos
 }

 function calculateTouchPoint(evt) {
  const domRect = AppStore.getValue('canvas:domrect')
  if (!evt.touches || _paused || !evt.touches.length) {
   return
  }
  const { x, y } = updatePosOnDragXY(evt)
  const newX = x - _previousXY[0]
  const newY = y - _previousXY[1]
  const xMapped = (domRect.width / _width) * x
  const yMapped = (domRect.height / _height) * y * -1
  let [r, phi] = xy2polar(xMapped, yMapped)
  let deg = rad2deg(phi)
  let hue = deg
  let saturation = r
  let value = 1.0
  let [red, green, blue] = hsv2rgb(hue, saturation, value, true)
  touchesPayload[0] = deg
  touchesPayload[1] = r
  touchesPayload[2] = red
  touchesPayload[3] = green
  touchesPayload[4] = blue
  touchesPayload[5] = x
  touchesPayload[6] = y
  AppEmitter.emit('interface:touches', touchesPayload)
 }

 function resize({ width, height }) {
  _width = width
  _height = height
 }

 function init(el, { width, height }) {
  _width = width
  _height = height
  addTouchEvents(el, {
   start: calculateTouchPointStart,
   move: calculateTouchPoint,
   width,
   height,
  })
 }
 function draw() {
  drawCircle(ctx, _width / 2)
 }
 function pause(val) {
  _paused = val
 }
 function setPreviousXY(arr) {
  _previousXY = arr
 }
 return {
  init,
  draw,
  pause,
  setPreviousXY,
  resize,
 }
}
