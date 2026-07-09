import { WebSocketServer } from 'ws'
import { handleMessage } from './handleMessage.js'

const PORT = Number(process.env.PORT) || 3001

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', (socket) => {
  socket.on('message', (data) => {
    const response = handleMessage(data.toString())
    socket.send(JSON.stringify(response))
  })
})

console.log(`WebSocket server listening on ws://localhost:${PORT}`)
