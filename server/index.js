const ffmpeg = require('./ffmpeg')()

const path = require('path')

const express = require('express')
var bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = 3000
app.use(express.static(path.join(process.cwd(), 'public')))

app.get('/', (request, reply) => {
  reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

app.post('/stream', (req, reply) => {
  const { body } = req
  switch (body.action) {
    case 'start':
      {
        ffmpeg.start(body.data)
      }
      break
    case 'stop':
      {
        ffmpeg.stop()
      }
      break
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*





const fastify = require('fastify')()

const ffmpeg = require('./ffmpeg')()

fastify.use(require('cors')())
fastify.register(require('fastify-static'), {
  root: path.join(process.cwd(), 'public'),
})

fastify.get('/', async (request, reply) => {
  reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

fastify.post('/stream', async ({ query, params, headers, body }, reply) => {
  switch (body.action) {
    case 'start': {
      ffmpeg.start(body.key)
    }
    break;
    case 'stop': {
      ffmpeg.stop()
    }
    break;
  }
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.listen(3000, (err, address) => {
  console.log(`server listening on ${address}`);
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})
*/
