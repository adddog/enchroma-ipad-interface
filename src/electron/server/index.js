const path = require('path')
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
console.log( path.join(process.cwd(), '.env'));
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env.prod'),
})
const PORT = process.env.API_PORT || 3000
const WS_PORT = process.env.WS_PORT || 3333

const WS = require('./websocket')({port: WS_PORT})

const app = express()
app.use(cors()) // for parsing application/json
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const publicDir = path.join('/public')
app.use(express.static(publicDir))

app.get('/', (request, reply) => {
  reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

app.get('/int', (request, reply) => {
  reply.sendFile(path.join(publicDir, 'interface/index.html'))
})

app.get('/exp', (request, reply) => {
  reply.sendFile(path.join(publicDir, 'experiment/index.html'))
})

app.post('/api', (req, reply) => {
  const { body } = req
  switch(body.action){
    case "refresh":
    case "setActiveTest":
      WS.sendAction(body)
    break;
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
  console.log(`websocket port: ${WS_PORT}`)
})
