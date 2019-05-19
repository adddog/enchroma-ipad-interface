import SocketPeer from "socketpeer"
import { autobind } from "core-decorators"
import AppEmitter from "c:/emitter"
import { SIGNALING_URL } from "c:/constants"
import WebsocketHandlers from "exp:lib/handlers"

export default class WS {
  constructor() {
    this.peer = new SocketPeer({
      pairCode: "enchroma",
      url: SIGNALING_URL,
      debug: false,
    })

    this.peer.on("connect", this.onConnect)
    this.peer.on("connect_timeout", this.onConnectTimeout)
    this.peer.on("data", this.onData)
    this.peer.on("rtc.signal", this.onRtcSignal)
    this.peer.on("peer.found", this.onPeerFound)
    this.peer.on("upgrade", this.onUpgrade)
    this.peer.on("upgrade_attempt", this.onUpgradeAttempt)
    this.peer.on("downgrade", this.onDowngrade)
    this.peer.on("warning", this.onWarning)
    this.peer.on("error", this.onError)

    AppEmitter.on("interface:touches", coords => {
      this.send(
        JSON.stringify({ type: "interface:touches", data: coords })
      )
    })
  }

  @autobind
  onConnect() {
    console.log("peer connected")
  }
  @autobind
  onConnectTimeout() {
    console.error(
      "connection timed out (after %s ms)",
      this.peer.timeout
    )
  }

  @autobind
  onData(payload) {
    if (payload.type === "interface:touches") {
      WebsocketHandlers.testTouches(payload.data)
    }
  }

  @autobind
  onRtcSignal() {
    console.log("WebRTC signalling")
  }

  @autobind
  onPeerFound(data) {
  }

  @autobind
  onUpgrade() {
    console.log(
      "successfully upgraded WebSocket ⇒ to WebRTC peer connection"
    )
  }

  @autobind
  onUpgradeAttempt() {
    console.log(
      "attempting to upgrade WebSocket ⇒ to WebRTC peer connection (attempt number: %d)",
      this.peer._connections.rtc.attempt
    )
  }

  @autobind
  onDowngrade() {
    console.log(
      "downgraded WebRTC peer connection ⇒ to WebSocket connection"
    )
  }

  @autobind
  onWarning(data) {
    console.error("warning:", data.message)
  }

  @autobind
  onError(err) {
    console.error("error:", err)
  }
  /* ------------------------ */
  //
  /* ------------------------ */
  @autobind
  send(data) {
    this.peer.send(data)
  }
}
