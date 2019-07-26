import html from "choo/html"
import classnames from "classnames"
import AppEmitter from "c:/emitter"
import { getRGBString, getRGBStringArray } from "c:/util"
import { autobind } from "core-decorators"
import {
  isDev,
  RGB_GREY_NEUTRAL,
  CIRCLE_STROKE_WIDTH,
  RGB_GREY_NEUTRAL_DARK,
  RGB_GREY_NEUTRAL_LIGHTEST,
  CIRCLE_MARGIN,
} from "c:/constants"
import AppStore from "c:/store"
import {
  getRes,
  getRGBFromInterfacePayload,
  getXYFromInterfacePayload,
  getHeight,
  getWidth,
} from "c:/selector"
import { isInduction, isMatch, isRest } from "c:/state-machine"
import { getActiveTestBlock } from "pad:/selectors"
import { ConnectedBaseComponent } from "pad:/views/base"
import Two from "two.js"
import Drawing from "./exp-drawing"
import DotDrawing from "./dot-drawing"

/* ************
 *  CIRCLE
 ************ */
class ControlsComponent extends ConnectedBaseComponent {
  createElement(state) {
    this.state = {
      activeTestBlock: getActiveTestBlock(state),
      interfaceData: null,
      isLeft: false,
    }
    return html`
      <div class="full-wh"></div>
    `
  }

  get payloadRGBString() {
    return this.state.interfaceData
      ? getRGBStringArray(
          getRGBFromInterfacePayload(this.state.interfaceData)
        )
      : getRGBStringArray(this.state.activeTestBlock.WHITE)
  }

  onStoreTestUpdate(testBlock) {
    if (!testBlock || this.state.activeTestBlock === testBlock) {
      return
    }
    this.state.activeTestBlock = testBlock
    this.drawCircle(
      getRGBStringArray(this.state.activeTestBlock.BACKGROUND_GREY),
      getRGBStringArray(
        this.state.activeTestBlock.BACKGROUND_GREY.map(v => v - 2)
      )
    )
    if (isInduction(testBlock)) {
      if (this.dotDrawing) {
        this.dotDrawing.tick()
      }
      this.dotDrawing.resume()
      this.state.isLeft = !this.state.isLeft
      Drawing.drawInductionHalf(
        getRGBStringArray(this.state.activeTestBlock.RGB_TEST_VALUES),
        this.state.isLeft
      )
      Drawing.drawMatchHalf(
        getRGBStringArray(
          this.state.activeTestBlock.MATCH_WHITE ||
            this.state.activeTestBlock.BACKGROUND_GREY
        )
      )
    } else if (isMatch(this.state.activeTestBlock)) {
      Drawing.drawMatchHalf(
        this.state.interfaceData
          ? getRGBStringArray(
              getRGBFromInterfacePayload(this.state.interfaceData)
            )
          : getRGBStringArray(this.state.activeTestBlock.WHITE)
      )
      Drawing.drawInductionHalf(
        getRGBStringArray(this.state.activeTestBlock.WHITE),
        this.state.isLeft
      )
      /*Drawing.drawInductionHalf(
        this.payloadRGBString,
        this.state.isLeft
      )*/
      // this.dotDrawing.pause()
      // Drawing.drawMatchHalf(getRGBStringArray(this.state.activeTestBlock.BACKGROUND_GREY))
    } else if (isRest(testBlock)) {
      Drawing.drawInductionHalf(
        getRGBStringArray(this.state.activeTestBlock.BACKGROUND_GREY)
      )
      Drawing.drawMatchHalf(
        getRGBStringArray(this.state.activeTestBlock.BACKGROUND_GREY)
      )
    }
  }

  onPeramsUpdate(data) {
    console.log(data);
  }
  onStoreInterfaceUpdate(data) {
    this.state.interfaceData = data
    if (isMatch(this.state.activeTestBlock)) {
      Drawing.drawMatchHalf(
        getRGBStringArray(getRGBFromInterfacePayload(data))
      )
      /*Drawing.updateInductionHalf(
        getRGBStringArray(getRGBFromInterfacePayload(data)),
        this.state.isLeft
      )*/
    }
  }

  @autobind
  resize(res) {
    this.logic && this.logic.resize(res)
  }

  get diameter() {
    return (
      Math.min(this.el.offsetWidth, this.el.offsetHeight) -
      CIRCLE_MARGIN
    )
  }

  drawCircle(color, strokeColor) {
    this.circle = this.two.makeCircle(
      getWidth() / 2,
      getHeight() / 2,
      this.diameter / 2
    )

    this.circle.fill = color || RGB_GREY_NEUTRAL_DARK
    this.circle.stroke = strokeColor || RGB_GREY_NEUTRAL_DARK
    this.circle.linewidth = CIRCLE_STROKE_WIDTH

    this.drawDot()
    this.group.add(this.circle)
    this.two.update()
  }

  drawDot(color = RGB_GREY_NEUTRAL) {
    this.dot = this.two.makeCircle(getWidth() / 2, getHeight() / 2, 4)
    this.dot.fill = color
    this.dot.stroke = color
    this.dot.linewidth = 0
    this.group.add(this.dot)
  }

  load(el) {
    super.load(el)
    this.el = el
    AppStore.setValue("canvas:domrect", el.getBoundingClientRect())

    var params = {
      type: Two.Types.canvas,
      ...getRes(),
    }
    this.two = new Two(params).appendTo(el)

    this.group = this.two.makeGroup()
    Drawing.setTwo(this.two)
    Drawing.setGroup(this.two.makeGroup())
    Drawing.setTestBlock(this.state.activeTestBlock)
    Drawing.setRadius(this.diameter / 2 - CIRCLE_STROKE_WIDTH)
    this.drawCircle()
    this.onStoreTestUpdate(this.state.activeTestBlock)

    this.dotDrawing = DotDrawing(this.two, {
      radius: 6,
      strength: 0.000925,
      mass: 1,
      numDots: 8,
    })
  }

  update() {
    return false
  }
}

export const Controls = ControlsComponent
