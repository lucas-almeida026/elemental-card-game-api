import { IDeck } from "./card";

export type Player = {
  id: string,
  data: {
    nickname: string,
    rankPoints: number,
    decks: any[]
  }
}

export interface IAdversary {
  nickname: string,
  rankPoints: number,
  decks: IDeck[]
}