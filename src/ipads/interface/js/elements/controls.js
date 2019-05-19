import html from "choo/html"
import classnames from "classnames"
import AppEmitter from "c:/emitter"
import { getRGBString } from "c:/util"
import { autobind } from "core-decorators"
import {
  isDev,
  RGB_GREY_NEUTRAL,
  RGB_GREY_NEUTRAL_DARK,
  RGB_GREY_NEUTRAL_LIGHTEST,
  CIRCLE_MARGIN,
} from "c:/constants"
import AppStore from "c:/store"
import {
  getRes,
  getXYFromInterfacePayload,
  getHeight,
  getWidth,
} from "c:/selector"
import { isInduction, isMatch, isRest } from "c:/state-machine"
import { getActiveTestBlock } from "i:selectors"
import Overlay from "pad:/views/overlay"
import { ConnectedBaseComponent } from "pad:/views/base"
import Two from "two.js"
import CodeMirror from "codemirror"
import Logic from "./circle-logic"
import DevLogic from "./dev-circle-logic"

const overlay = new Overlay()

/* ************
 *  CIRCLE
 ************ */
class ControlsComponent extends ConnectedBaseComponent {
  createElement(state) {
    this.state = {
      activeTestBlock: getActiveTestBlock(state),
    }
    if (isDev) {
      AppEmitter.on("touches", this.drawTouchColor)
    }
    return html`
      <div class="full-wh">
        ${overlay.render()}
      </div>
    `
  }

  onStoreTestUpdate(testBlock) {
    this.logic.setPreviousXY(
      getXYFromInterfacePayload(
        AppStore.getValue("interface:touches")
      )
    )
    if (testBlock) {
      this.logic.pause(!isMatch(testBlock))
    }
    if (isDev) {
      //this.addPreviousXY(testBlock)
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

  drawCircle() {
    this.circle = this.two.makeCircle(
      getWidth() / 2,
      getHeight() / 2,
      this.diameter / 2
    )
    this.circle.fill = RGB_GREY_NEUTRAL
    this.circle.stroke = RGB_GREY_NEUTRAL_DARK
    this.circle.linewidth = 3

    this.drawDot()
    this.two.update()
  }

  drawDot(color = RGB_GREY_NEUTRAL_LIGHTEST) {
    this.dot = this.two.makeCircle(getWidth() / 2, getHeight() / 2, 4)
    this.dot.fill = color
    this.dot.stroke = color
    this.dot.linewidth = 0
  }

  @autobind
  addPreviousXY(testBlock) {
    return
    console.log(testBlock)
    console.log(
      testBlock.previousXY[0] * this.diameter,
      testBlock.previousXY[1] * this.diameter
    )
    const p = this.two.makeCircle(
      getWidth() / 2 + testBlock.previousXY[0] * this.diameter,
      getHeight() / 2 + testBlock.previousXY[1] * this.diameter,
      9
    )
    p.fill = "red"
    p.stroke = "red"
    p.linewidth = 0
    this.two.update()
  }

  @autobind
  drawTouchColor(arr) {
    if (!this.touchCircle) {
      this.touchCircle = this.two.makeCircle(arr[5], arr[6], 9)
      this.touchCircle.fill = "red"
      this.touchCircle.stroke = "red"
      this.touchCircle.linewidth = 0
    } else {
      this.touchCircle.fill = getRGBString(
        Math.floor(arr[2] * 255),
        Math.floor(arr[3] * 255),
        Math.floor(arr[4] * 255)
      )
      this.touchCircle.translation.set(arr[5] - 20, arr[6] - 20)
    }
    this.two.update()
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
    this.drawCircle()

    this.logic = Logic()
    this.logic.init(el, {
      width: this.diameter,
      height: this.diameter,
      onMove: isDev ? DevLogic.addPoint : null,
      onEnd: isDev ? DevLogic.touchEnd : null,
    })
    this.logic.pause(!isMatch(this.state.activeTestBlock))

    if (isDev) {
      DevLogic.init(this.two)
    }
  }

  update() {
    return false
  }
}

export const Controls = ControlsComponent
