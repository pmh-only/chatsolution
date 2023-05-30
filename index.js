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
let sockets = []

app.use(cors())
app.get('/', (_, res) => {
  res.set('Content-Type', 'text/javascript')
  res.send(readFileSync('./client.js', 'utf-8'))
})

io.on('connection', (socket) => {
  io.emit('Someone connected.')
  sockets.push(socket)
  socket.join('main')

  for (const lastChat of last10chat)
    socket.emit('chat', { type: 'history', ...lastChat })

  socket.on('chat', (data) => {
    if (last10chat.length > 9)
      last10chat = last10chat.slice(1)
      
    last10chat.push(data)
    io.to(socket.rooms[0]).emit('chat', data)
  })

  socket.on('room', (room) => {
    socket.leave(socket.rooms[0])
    socket.join(room)
  })

  socket.on('rooms', () => {
    const rooms = new Set()
    for (const selSocket of sockets)
      rooms.add(selSocket.room)

    socket.emit()
  })

  socket.on('disconnect', () => {
    io.emit('Someone disconnected.')
    sockets = sockets.filter((v) => v.id = socket.id)
  })
})

server.listen(80)
