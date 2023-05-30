const http = require('http')
const { Server } = require("socket.io")

const server = http.createServer()
const io = new Server(server, {
  cors: { origin: '*' }
})

io.on('connection', (socket) =>
  socket.on('broadcast', (data, ack) =>
    io.emit('broadcast', data) && ack?.()))

server.listen(80)
