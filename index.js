import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 80 })

wss.on('connection', (ws) =>
  ws.on('message', (data) =>
    wss.clients.forEach((client) =>
      client.readyState === WebSocket.OPEN &&
        client.send(data))))
