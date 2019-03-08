import html from 'choo/html'
import Nanocomponent from 'nanocomponent'
import CodeMirror from 'codemirror'
import { getActiveTest } from 'el:selectors'

class CodeEditor extends Nanocomponent {
 createElement(config, emit) {
  this.config = config
  this.emit = emit
  return html`
   <div class="code-editor full-wh"></div>
  `
 }

 load(el) {
  this.el = el
  var myCodeMirror = CodeMirror(this.el, {
   value: JSON.stringify(this.config, null, 4),
   lineNumbers: true,
   mode: 'javascript',
  })
  myCodeMirror.setSize('100%', '100%')
  myCodeMirror.on('change', c => {
   let json
   try {
    json = JSON.parse(c.getValue())
    this.emit('editor:change', json)
   } catch (e) {
    this.emit('editor:change', e)
   }
  })
 }

 update() {
  return false
 }
}

exports.CodeEditor = CodeEditor
