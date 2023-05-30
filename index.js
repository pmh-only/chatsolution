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
  io.emit('chat', 'Someone connected.')
  sockets.push(socket)
  socket.join('main')
  
  for (const lastChat of last10chat)
    socket.emit('chat', { type: 'history', ...lastChat })
    
  socket.on('chat', (data) => {
    const [, connectedRoom] = socket.rooms

    if (last10chat.length > 9)
      last10chat = last10chat.slice(1)
    
    last10chat.push(data)
    io.to(connectedRoom).emit('chat', data)
  })

  socket.on('room', (room) => {
    const [, connectedRoom] = socket.rooms

    socket.leave(connectedRoom)
    socket.join(room)
  })

  socket.on('rooms', () => {
    const rooms = new Set()
    for (const selSocket of sockets) {
      const [, connectedRoom] = selSocket.rooms
      rooms.add(connectedRoom)
    }

    socket.emit('chat', [...rooms.values()])
  })

  socket.on('disconnect', () => {
    io.emit('chat', 'Someone disconnected.')
    sockets = sockets.filter((v) => v.id = socket.id)
  })
})

server.listen(80)
