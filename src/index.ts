import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

const port = process.env.PORT || 8090
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
  res.send('asd')
})

io.on('connection', (socket) => {
  console.log(`new user connected with id ${socket.id} a`)
})

server.listen(port, () => console.log(`socket listening as port ${port}`))