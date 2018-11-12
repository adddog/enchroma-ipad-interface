import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import Circle from 'elements/circle'
import Slider from 'elements/slider'

module.exports = (state, emit) => {
  return html`
        <article class="w-100 h-100 black-80 columns interface-view">
          ${Slider(state, emit)}
          ${Circle(state, emit)}
        </article>
      `
}
