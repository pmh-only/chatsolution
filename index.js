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

let last10chat = []

app.use(cors())
app.get('/', (_, res) => {
  res.set('Content-Type', 'text/javascript')
  res.send(readFileSync('./client.js', 'utf-8'))
})

io.on('connection', (socket) => {
  for (const lastChat of last10chat)
    socket.emit(lastChat)

  socket.on('chat', (data) => {
    last10chat = last10chat.slice(1)
    last10chat.push(data)

    io.emit('chat', data)
  })
})

server.listen(3000)
