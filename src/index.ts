import express from 'express'
import { Server, Socket } from 'socket.io'
import http from 'http'

const port = process.env.PORT || 8090
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'elemental-card-game.web.app', 'elemental-card-game.firebaseapp.com'],
    credentials: false
  }
})

app.get('/', (req, res) => {
  res.send('asd')
})

const onJoinQueue = (socket: Socket, data: any) => {
  socket.data = data
  socket.join('Queue')
}

const onLeaveQueue = (socket: Socket) => {
  socket.leave('Queue')
}

const onConnect = (socket: Socket) => {
  console.log(`new user connected with id ${socket.id} a`)
  socket.on('joinQueue', (data) => onJoinQueue(socket, data))
  socket.on('leaveQueue', () => onLeaveQueue(socket))
}

io.on('connection', onConnect)


interface Player {
  id: string,
  data: {
    nickname: string,
    rankPoints: number,
    decks: any[]
  }
}

const matchPlayers = (players: Player[], maxDiff = 0) => {
  const rooms = []
  if(players.length === 2){
    return [[players[0], players[1]]]
  }
  return null
  // if(maxDiff === 0){
  //   if(players.length >= 2){
  //     if(players.length % 2 === 0){
        
  //     }else{

  //     }
  //   }
  // }
}
const handleRoomsFromAdapter = async (path: string, room: any, id: string) => {
  const allInQueue = await io.of(path).in(room).fetchSockets()
  const allPlayers = allInQueue.map(e => ({data: e.data, id: e.id}) as Player)
  const rooms = matchPlayers(allPlayers)
  if(!!rooms){
    const player1Ref = allInQueue.filter(e => e.id === rooms[0][0].id)
    if(!!player1Ref && !!player1Ref.length && player1Ref.length > 0){
      player1Ref[0].emit('roomFound', {roomId: 'some id'})
    }
  }
  // const playerRef = allInQueue.filter(e => e.id === id)
  // console.log(playerRef)
  // const player = !!playerRef && playerRef.length > 0 ? playerRef[0] : null
  // if(!!player){
  //   console.log(allPlayers.length)
  // }
}

io.of('/').adapter.on('join-room', async (room, id) => {
  await handleRoomsFromAdapter('/', room, id)
})

io.of('/').adapter.on('leave-room', async (room, id) => {
  await handleRoomsFromAdapter('/', room, id)
})

server.listen(port, () => console.log(`socket listening as port ${port}`))