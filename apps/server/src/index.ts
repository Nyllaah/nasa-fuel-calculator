import { WebSocketServer } from 'ws'
import { errors } from './constants/errors.js'
import { handleMessage } from './handleMessage.js'

const PORT = Number(process.env.PORT) || 3001

const wss = new WebSocketServer({ port: PORT })

let connectionCount = 0

wss.on('connection', (socket) => {
  const connectionId = ++connectionCount
  console.log(`Client connected (${connectionId})`)

  socket.on('message', (data) => {
    try {
      const response = handleMessage(data.toString())

      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(response))
      }
    } catch (error) {
      console.error(`Message handler error (${connectionId}):`, error)

      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify({ error: errors.INTERNAL_SERVER_ERROR }))
      }
    }
  })

  socket.on('close', () => {
    console.log(`Client disconnected (${connectionId})`)
  })

  socket.on('error', (error) => {
    console.error(`Socket error (${connectionId}):`, error.message)
  })
})

wss.on('error', (error) => {
  console.error('WebSocket server error:', error.message)
})

console.log(`WebSocket server listening on ws://localhost:${PORT}`)
