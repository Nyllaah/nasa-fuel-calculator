import { WebSocketServer } from 'ws'

const PORT = Number(process.env.PORT) || 3001

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', (socket) => {
  socket.on('message', (data) => {
    socket.send(data)
  })
})

console.log(`WebSocket server listening on ws://localhost:${PORT}`)
