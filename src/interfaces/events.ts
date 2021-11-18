import { IAdversary } from "./player";

export interface BanAdversaryDeckEvent {
  adversary: IAdversary, 
  deckName: string,
  roomId: string
}

export interface DeckBan {
  roomId: string,
  deckName: string
}