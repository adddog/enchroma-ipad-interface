const path = require('path')
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const dotenv = require('dotenv').config({
  path: path.join(process.cwd(), '.env'),
})
const PORT = process.env.API_PORT
const WS_PORT = process.env.WS_PORT

const WS = require('./websocket')()

const app = express()
app.use(cors()) // for parsing application/json
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const publicDir = path.join(process.cwd(), 'public')
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
