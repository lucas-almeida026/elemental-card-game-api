import { Server, Socket } from "socket.io"
import { BanAdversaryDeckEvent, DeckBan } from "./interfaces/events"
import { IAdversary, Player } from "./interfaces/player"
import { Room } from "./interfaces/room"
import { makeId } from "./utils"

const rooms: Room[] = []

const getAllPlayersInQueue = async (io: Server) => {
  return await io.of('/').in('Queue').fetchSockets()
}

const onJoinQueue = (socket: Socket, data: any) => {
  socket.data = data
  socket.join('Queue')
}

const onLeaveQueue = (socket: Socket) => {
  socket.leave('Queue')
}

const onAcceptMatch = (io: Server, socket: Socket, roomId: string) => {
  const roomIds = rooms.filter(room => room.id === roomId).map(room => room.id)
  const room = rooms.find(room => room.id === roomId)
  if(roomIds.includes(roomId)){
    if(room){
      room.players[1] = socket.data
    }
  }else{
    rooms.push({
      id: roomId,
      players: [socket.data, null]
    })
  }
  if(room){
    if(room.players[0] && room.players[1]){
      room.players.forEach(async player => {
        (await getAllPlayersInQueue(io)).forEach(socket => {
          socket.leave('Queue')
          socket.join(roomId)
        })
      })
    }
  }
}

const onBanAdversaryDeck = async ({adversary, deckName, roomId}: BanAdversaryDeckEvent, io: Server) => {
  const adversarySocketRef = (await io.of('/').in(roomId).fetchSockets()).filter(e => e.data.nickname === adversary.nickname)
  if(!!adversarySocketRef && adversarySocketRef.length > 0){
    const socket = adversarySocketRef[0]
    socket.emit('deckBan', {deckName, roomId} as DeckBan)
  }
}

export const onConnect = (socket: Socket, io: Server) => {
  console.log(`new user connected with id ${socket.id} a`)
  socket.on('joinQueue', (data) => onJoinQueue(socket, data))
  socket.on('leaveQueue', () => onLeaveQueue(socket))
  socket.on('acceptMacth', (roomId) => onAcceptMatch(io, socket, roomId))
  socket.on('banAdversaryDeck', (data: BanAdversaryDeckEvent) => onBanAdversaryDeck(data, io))
}




const matchPlayers = (players: Player[], maxDiff = 0): Player[][] | null => {
  const rooms = []
  const playersCosidered = players.length % 2 === 0 ? players : players.slice(0, players.length - 1)
  if(maxDiff === 0){
    for(let i = 0; i < playersCosidered.length; i += 2){
      rooms.push([playersCosidered[i], playersCosidered[i + 1]])
    }
  }
  return rooms.length > 0 ? rooms : null
}

export const handleRoomsFromAdapter = async (io: Server, path: string, room: any, id: string) => {
  const allInQueue = await getAllPlayersInQueue(io)
  const allPlayers = allInQueue.map(e => ({data: e.data, id: e.id}) as Player)
  const rooms = matchPlayers(allPlayers)
  if(rooms){
    rooms.forEach((room: Player[]) => {
      const playerRefA = allInQueue.find(e => e.id === room[0].id)
      const playerRefB = allInQueue.find(e => e.id === room[1].id)
      if(playerRefA && playerRefB){
        const roomId = makeId(16)
        playerRefA.emit('roomFound', {roomId, adversary: playerRefB.data})
        playerRefB.emit('roomFound', {roomId, adversary: playerRefA.data})
      }
    })
  }
}

