var spawn = require('child_process').spawn
var exec = require('child_process').exec

function ffmpeg() {
  let _to,
    _counter = 0

  function start(data) {
    const { streamKey, restartStream, restartStreamValue } = data

    if (!streamKey) {
      console.error(`No streamKey found. Not starting ffmpeg`)
      return
    }
    // console.log('here')
    // command = exec(`ffplay udp://192.168.1.81:7777`)
    const c = `raspivid -o - -t 0 -vf -hf -fps 30 -b 6000000 | ffmpeg -re -ar 44100 -ac 2 -acodec pcm_s16le -f s16le -ac 2 -i /dev/zero -f h264 -i - -vcodec copy -acodec aac -ab 128k -g 50 -strict experimental -f flv rtmp://a.rtmp.youtube.com/live2/${streamKey}`
    console.log(c)
    command = exec(c)

    if (restartStream) {
      if (_to) clearTimeout(_to)
      _to = setTimeout(function() {
        command.kill()
        _to = null
        setTimeout(function() {
          _counter++
          console.log(`Restarting for the ${_counter} time`)
          start(data)
        }, 4000)
      }, restartStreamValue * 60 * 1000)
    }
  }

  function stop() {
    console.log('stop')
    command.kill()
  }
  return { start, stop }
}

module.exports = ffmpeg
