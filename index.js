const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})
const cors = require('cors')
const { readFileSync } = require('fs')

app.use(cors())
app.get('/', (_, res) => {
  res.set('Content-Type', 'text/javascript')
  res.send(readFileSync('./client.js', 'utf-8'))
})

io.on('connection', (socket) => {
  socket.join('main')
  
  socket.on('broadcast', (data, ack) => {
    io.emit('boardcast', data)
    ack?.()
  })
})

server.listen(80)
