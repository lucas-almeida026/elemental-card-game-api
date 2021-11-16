import { Player } from "./player";

export type Room = {
  id: string,
  players: [Player, Player | null],
}