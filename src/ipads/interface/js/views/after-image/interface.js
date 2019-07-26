import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import { GREY_NEUTRAL  } from 'c:/constants'
import { getRGBString } from 'i:lib/drawing-helpers'
import Circle from 'i:elements/circle'
import Slider from 'i:elements/slider'

module.exports = (state, emit) => {
  return html`
        <article class="w-100 h-100 black-80 columns interface-view" style="background-color: ${getRGBString(
          getRGBStringArray(getActiveTestBlock(state).BACKGROUND_GREY),
        )}">
          ${Slider(state, emit)}
          ${Circle(state, emit)}
        </article>
      `
}
