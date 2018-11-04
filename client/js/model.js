const postJSON = (url, json) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  })

export default (state, emitter) => {
  state.videoForm = {
    streamKey: '',
    restartStream: true,
    restartStreamValue: 360,
  }

  emitter.on('set:streamkey', formValues => {
    state.videoForm = {
      streamKey: formValues[0],
      restartStream: formValues[1],
      restartStreamValue: formValues[2],
    }
    state.streamKey =  formValues[0]
    emitter.emit('render')
  })

  emitter.on('controls:stream:start', key => {
    postJSON('/stream', { action: 'start', data: state.videoForm })
  })
  emitter.on('controls:stream:stop', key => {
    postJSON('/stream', { action: 'stop' })
  })

  emitter.emit('render')
}
