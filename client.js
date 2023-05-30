import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

const socket = io('wss://chatsolution.shutupandtakemy.codes')
let author = '익명의 누군가'
let room = undefined

socket.on('broadcast', (data) => {
  if (data.room === undefined || data.room === room)
    console.log(data)
})

window.a = ([authorName]) => {
  author = authorName
  return { type: 'author name changed', success: true }
}

window.c = ([message]) => {
  socket.emit('broadcast', { success: true, room, author, message })
  return { type: 'message sent', success: true }
}

window.r = ([roomId]) => {
  room = roomId || undefined
  return { type: 'room changed', success: true }
}
