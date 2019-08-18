import SocketPeer from "socketpeer"
import { autobind } from "core-decorators"
import AppEmitter from "c:/emitter"
import { WS_URL } from "c:/constants"
import WebsocketHandlers from "exp:lib/handlers"

export default class WS {
  constructor() {
    this.peer = new SocketPeer({
      pairCode: "enchroma",
      url: WS_URL,
      debug: true,
    })

    this.peer.on("connect", this.onConnect)
    this.peer.on("connect_timeout", this.onConnectTimeout)
    this.peer.on("data", this.onData)
    this.peer.on("rtc.signal", this.onRtcSignal)
    this.peer.on("peer.found", this.onPeerFound)
    this.peer.on("upgrade", this.onUpgrade)
    this.peer.on("upgrade_attempt", this.onUpgradeAttempt)
    this.peer.on("downgrade", this.onDowngrade)
    this.peer.on("close", this.onClose)
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
    AppEmitter.emit("logs", "connection timed out")
  }

  @autobind
  onData(payload) {
    if (payload.type === "interface:touches") {
      WebsocketHandlers.testTouches(payload.data)
    }
  }

  @autobind
  onRtcSignal() {
    AppEmitter.emit("logs", "WebRTC signalling")
  }

  @autobind
  onPeerFound(data) {
    AppEmitter.emit("logs", "Peer found")
  }

  @autobind
  onUpgrade() {
    AppEmitter.emit(
      "logs",
      "successfully upgraded WebSocket ⇒ to WebRTC peer connection"
    )
    AppEmitter.emit("webrtc:connected")
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
    AppEmitter.emit(
      "logs",
      `attempting to upgrade WebSocket ⇒ to WebRTC peer connection (attempt number: ${
        this.peer._connections.rtc.attempt
      })`
    )
  }

  @autobind
  onDowngrade() {
    AppEmitter.emit("webrtc:disconnect")
    AppEmitter.emit("logs", "Downgraded")
  }

  @autobind
  onClose() {
    AppEmitter.emit("webrtc:disconnect")
  }

  @autobind
  onWarning(data) {
    console.error("warning:", data.message)
  }

  @autobind
  onError(err) {
    AppEmitter.emit("logs", `Error ${err}`)
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
