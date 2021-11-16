import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { handleRoomsFromAdapter, onConnect } from './socketFunctions'

const port = process.env.PORT || 8090
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: false
  }
})

app.get('/', (req, res) => {
  res.send('asd')
})

io.on('connection', (socket) => onConnect(socket, io))

io.of('/').adapter.on('join-room', async (room, id) => {
  await handleRoomsFromAdapter(io, '/', room, id)
})

io.of('/').adapter.on('leave-room', async (room, id) => {
  await handleRoomsFromAdapter(io, '/', room, id)
})

server.listen(port, () => console.log(`socket listening at port ${port}`))