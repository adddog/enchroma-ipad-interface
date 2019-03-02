import html from 'choo/html'
import Nanocomponent from 'nanocomponent'

import libraryView from 'el:views/library'
import interfaceView from 'el:views/interface'

module.exports = (state, emitter, prev) => {
 if (state.activeTest) return interfaceView(state, emitter, prev)
 return libraryView(state, emitter, prev)
}
