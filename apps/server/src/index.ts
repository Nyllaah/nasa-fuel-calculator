import { WebSocketServer } from 'ws'
import { validateRequest } from './validate.js'

const PORT = Number(process.env.PORT) || 3001

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', (socket) => {
  socket.on('message', (data) => {
    let parsed: unknown

    try {
      parsed = JSON.parse(data.toString())
    } catch {
      socket.send(JSON.stringify({ error: 'Invalid JSON' }))
      return
    }

    const validated = validateRequest(parsed)

    if (typeof validated === 'string') {
      socket.send(JSON.stringify({ error: validated }))
      return
    }

    socket.send(JSON.stringify({ valid: true, request: validated }))
  })
})

console.log(`WebSocket server listening on ws://localhost:${PORT}`)
