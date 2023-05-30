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
  io.emit('chat', 'Someone connected.')
  socket.join('main')
  
  for (const lastChat of last10chat)
    socket.emit('chat', { type: 'history', ...lastChat })
    
  socket.on('chat', (data, ack) => {
    if (last10chat.length > 9)
      last10chat = last10chat.slice(1)
    
    last10chat.push(data)
    io.emit('chat', data)
    ack()
  })

  socket.on('disconnect', () => {
    io.emit('chat', 'Someone disconnected.')
  })
})

server.listen(80)
