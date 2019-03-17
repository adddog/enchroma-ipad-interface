import html from 'choo/html'
import {
 getRes,
 getXYFromInterfacePayload,
 getHeight,
 getWidth,
} from 'c:/selector'
import { getRGBStringArray } from 'c:/util'

const HALF_PI = Math.PI / 2
const THREE_Q_PI = Math.PI * 1.5
const HALF_PI_END = HALF_PI + Math.PI
const THREE_Q_PI_END = THREE_Q_PI + Math.PI

class ExpDrawing {
 setTwo(two) {
  this.two = two
  this.inductionHalf
  this.matchHalf
  this.isLeft
 }

 getArcStart(isLeft = this.isLeft) {
  return isLeft ? HALF_PI : THREE_Q_PI
 }

 getArcStartEnd(isLeft = this.isLeft) {
  return isLeft ? HALF_PI_END : THREE_Q_PI_END
 }

 setRadius(radius) {
  this.radius = radius
 }

 setTestBlock(testBlock) {
  this.testBlock = testBlock
 }

 drawInductionHalf(color, isLeft = false) {
  this.isLeft = isLeft
  this.inductionHalf = this.two
   .makeArcSegment(
    getWidth() / 2,
    getHeight() / 2,
    0,
    this.radius,
    this.getArcStart(),
    this.getArcStartEnd(),
   )
   .noStroke()
  this.inductionHalf.fill = color
  this.two.update()
 }

 updateInductionHalf(color, isLeft = false) {
  this.inductionHalf.fill = color
  this.two.update()
 }

 drawMatchHalf(color) {
  this.matchHalf = this.two
   .makeArcSegment(
    getWidth() / 2,
    getHeight() / 2,
    0,
    this.radius,
    this.getArcStart(!this.isLeft),
    this.getArcStartEnd(!this.isLeft),
   )
   .noStroke()
  this.matchHalf.fill = color
  this.two.update()
 }
}
export default new ExpDrawing()
