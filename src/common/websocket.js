import { isProd } from 'c:/constants'
import AppEmitter from 'c:/emitter'
import safeStringify from 'fast-safe-stringify'

function get_appropriate_ws_url()
{
  var pcol;
  var u = document.URL;

  /*
   * We open the websocket encrypted if this page came on an
   * https:// url itself, otherwise unencrypted
   */

  if (u.substring(0, 5) == "https") {
    pcol = "wss://";
    u = u.substr(8);
  } else {
    pcol = "ws://";
    if (u.substring(0, 4) == "http")
      u = u.substr(7);
  }

  u = u.split('/');

  return pcol + u[0];
}

class WS {
 constructor() {
  this.init()
 }

 init(ip = 'localhost', port = process.env.WS_PORT) {
  //this.client = new WebSocket(`ws://${ip}:${port}`)
  console.log('connecting to : `ws://enchroma2-wss.ngrok.io/');
  this.client = new WebSocket(`ws://enchroma2-wss.ngrok.io/`)

  this.client.onerror = (e) => {
    console.log(e);
  }

  this.client.onopen = () => {
   AppEmitter.emit('websocket:connected', true)
   this.onopen()
  }

  this.client.onclose = () => {
   AppEmitter.emit('websocket:connected', false)
   setTimeout(() => {
    this.client.close()
    this.client = null
    this.init()
   }, 1500)
  }
 }

 send(data, type) {
  this.client.send(safeStringify({ data, type }))
 }

 onMessage() {}
}

export default WS
