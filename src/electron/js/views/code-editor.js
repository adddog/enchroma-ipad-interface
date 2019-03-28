import html from 'choo/html'
import { autobind } from 'core-decorators'
import Nanocomponent from 'nanocomponent'
import CodeMirror from 'codemirror'
import { getActiveTest } from 'el:selectors'
import renderButton from 'c:/elements/button'

class CodeEditor extends Nanocomponent {
 createElement(config, emit) {
  this.config = config
  this.emit = emit
  return html`
   <div class="full-wh u-flex u-flex--start u-flex--stack">
    <p>Edit the configuration before starting the test.</p>
    ${renderButton(
     {
      text: 'Import',
      class: 'column col-auto mx-1 my-2',
      id: 'import-config',
      disabled: config.testStarted,
     },
     evt => emit('el:config:import', evt.target.dataset.id),
    )}
    <div class="code-editor full-wh"></div>
    ${renderButton(
     {
      text: 'Export',
      class: 'column col-auto mx-1 my-2',
      id: 'export-config',
      disabled: config.testStarted,
     },
     evt => emit('el:config:export', this.myCodeMirror.getValue()),
    )}
   </div>
  `
 }

 @autobind
 onChange(e) {
  let json
  try {
   json = JSON.parse(e.getValue())
   this.emit('editor:change', json)
  } catch (err) {
   this.emit('editor:change', err)
  }
 }

 load(el) {
  this.el = el
  this.myCodeMirror = CodeMirror(
   this.el.querySelector('.code-editor'),
   {
    value: JSON.stringify(this.config, null, 4),
    lineNumbers: true,
    mode: 'javascript',
   },
  )
  console.log(this.myCodeMirror)
  this.myCodeMirror.setSize('100%', '100%')
  this.myCodeMirror.on('change', this.onChange)
 }

 update(config) {
  if (this.myCodeMirror) {
   this.myCodeMirror.setValue(JSON.stringify(config, null, 4))
  }
  return false
 }
}

exports.CodeEditor = CodeEditor
