import { cover, contain } from 'intrinsic-scale'
import { isDev, GREY_NEUTRAL, CIRCLE_MARGIN } from 'c:/constants'
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
  _options,
  _width,
  _height,
  _paused,
  _previousXY,
  _pos = {
   startX: 0,
   startY: 0,
   x: 0,
   y: 0,
   deltaX: 0,
   deltaY: 0,
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
  const xPos = (clientX * 2 - domRect.width) / _width / 2
  const yPos = ((clientY * 2 - domRect.height) / _height / 2) * -1
  return { x: xPos, y: yPos }
 }

 const updatePosOnDragXY = evt => {
  if (!evt.touches || _paused || !evt.touches.length) {
   return
  }
  const { x, y } = getNormalizedXY(evt)
  _pos.x = _pos.startX + (x - _pos.startX)
  _pos.y = _pos.startY + (y - _pos.startY)
  _pos.deltaX = x - _pos.startX
  _pos.deltaY = y - _pos.startY
  return _pos
 }

 function calculateTouchPointStart(evt) {
  if (!evt.touches || _paused || !evt.touches.length) {
   return
  }
  const { x, y } = getNormalizedXY(evt)
  _pos.startX = x
  _pos.startY = y
  return _pos
 }

 function calculateTouchPointEnd(evt) {
  if (_paused) {
   return
  }
  if (_options.onEnd) {
   _options.onEnd()
  }
 }

 function calculateTouchPoint(evt, pos) {
  const domRect = AppStore.getValue('canvas:domrect')
  if (!evt.touches || _paused || !evt.touches.length) {
   return
  }
  const { x, y, deltaX, deltaY } = updatePosOnDragXY(evt)
  if (_options.onMove) {
   _options.onMove({ x, y, pos })
  }
  let newX
  let newY
  if (_previousXY) {
   newX = _previousXY[0] + deltaX
   newY = _previousXY[1] + deltaY
  } else {
   newX = x
   newY = y
  }
  console.log('newX: ', newX, 'newY', newY)
  let [r, phi] = xy2polar(newX, newY)
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
  AppStore.setValue('interface:touches', touchesPayload)
  AppEmitter.emit('interface:touches', touchesPayload)
 }

 function resize({ width, height }) {
  _width = width
  _height = height
 }

 function init(el, options) {
  _options = options
  const { width, height } = _options
  _width = width
  _height = height
  console.log(_width, _height)
  addTouchEvents(el, {
   start: calculateTouchPointStart,
   move: calculateTouchPoint,
   end: calculateTouchPointEnd,
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
