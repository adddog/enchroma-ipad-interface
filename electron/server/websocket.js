const { isObject } = require('lodash')
const parse = require('fast-json-parse')
const WebSocket = require('ws')

module.exports = function() {
 const connections = new Map()

 const transformData = data => {
  if (isObject(data)) {
   return JSON.stringify(data)
  } else {
   return data
  }
 }
 const send = (connection, data) =>
  connection.send(transformData(data))

 const hasExperiment = () => connections.has('experiment')
 const getExperiment = () => connections.get('experiment')
 const sendExperiment = data =>
  hasExperiment() ? send(getExperiment(), data) : false

 const hasInterface = () => connections.has('interface')
 const getInterface = () => connections.get('interface')
 const sendInterface = data =>
  hasInterface() ? send(getInterface(), data) : false

 const wss = new WebSocket.Server({
  port: process.env.WS_PORT,
  perMessageDeflate: false,
 })

 wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
   const { value } = parse(data)
   switch (value.type) {
    case 'handshake': {
     connections.set(value.data, ws)
     console.log('Handshake', value.data)
     break
    }
    case 'interface:brightness':
    case 'interface:circle':
     {
      sendExperiment(data)
     }
     break
    case 'master:test:set':
    case 'master:test:start':{
     console.log(value)
     sendExperiment(value)
     sendInterface(value)
     break
    }
   }
  })
 })

 function sendAction(data) {
  switch (data.action) {
   case 'refresh': {
    sendExperiment(data)
    sendInterface(data)
    break
   }
   case 'setActiveTest': {
    sendExperiment(data)
    sendInterface(data)
    break
   }
  }
 }

 return {
  sendAction,
 }
}
