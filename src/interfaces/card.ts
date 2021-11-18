import { Classes } from "./class";
import { CardRarity } from "./rarities";

export interface ICard {
  name: string
  health: number
  armor: number
  shield: number
  damage: number
  rarity: CardRarity
  class: Classes
}

export interface IDeck {
  name: string
  cards: ICard[]
}

/**
 * 
 * card01: {
 *   class: fire
 *   rarity: c
 *   armor: 3
 *   damage: 13
 *   health: 10
 *   shield: 0
 *   imgName: card-img-template
 * }
 * 
 */