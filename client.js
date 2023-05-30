import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

const socket = io('wss://chatsolution.shutupandtakemy.codes')
let author = '익명의 누군가'

socket.on('connect', () => {
  console.log({ type: 'room connected', success: true })
})

socket.on('chat', (data) => {
  console.log(data)
})

window.a = ([data]) => {
  author = data
  return { type: 'author name changed', success: true }
}

window.c = ([chat]) => {
  socket.emit('chat', { success: true, author, data: chat })
  return { type: 'message sent', success: true }
}

window.r = ([room]) => {
  socket.emit('room', room)
  return { type: 'room changed', success: true }
}

window.rl = () => {
  socket.emit('rooms')
  return { type: 'request room list', success: true }
}
