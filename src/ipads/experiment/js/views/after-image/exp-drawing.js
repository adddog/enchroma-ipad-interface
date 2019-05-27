import html from "choo/html"
import {
  getRes,
  getXYFromInterfacePayload,
  getHeight,
  getWidth,
} from "c:/selector"
import { getRGBStringArray } from "c:/util"

const HALF_PI = Math.PI / 2
const TWO_PI = Math.PI * 2
const THREE_Q_PI = Math.PI * 1.5
const THREE_Q_CIRC = HALF_PI * 3
const THREE_Q_PI_END = THREE_Q_PI + Math.PI
const HALF_PI_END = HALF_PI + Math.PI

class ExpDrawing {
  setTwo(two) {
    this.two = two
    this.inductionHalf
    this.matchHalf
    this.isLeft

    this.group = two.makeGroup()
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
    if (this.inductionHalf) {
      this.group.remove(this.inductionHalf)
      this.two.remove(this.inductionHalf)
    }
    this.isLeft = isLeft
    this.inductionHalf = this.two
      .makeArcSegment(
        getWidth() / 2,
        getHeight() / 2,
        0,
        this.radius,
        -HALF_PI ,
        HALF_PI
      )
      .noStroke()
    this.inductionHalf.fill = color
    this.group.add(this.inductionHalf)
    //  this.two.update()
  }

  updateInductionHalf(color, isLeft = false) {
    this.inductionHalf.fill = color
    //  this.two.update()
  }

  drawMatchHalf(color) {
    if (this.matchHalf) {
      this.group.remove(this.matchHalf)
      this.two.remove(this.matchHalf)
    }
    this.matchHalf = this.two
      .makeArcSegment(
        getWidth() / 2,
        getHeight() / 2,
        0,
        this.radius,
        HALF_PI,
        THREE_Q_CIRC
      )
      .noStroke()
    this.matchHalf.fill = color
    this.group.add(this.matchHalf)
    //  this.two.update()
  }
}
export default new ExpDrawing()
