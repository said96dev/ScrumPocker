export type VotingSystem =
  | 'fibonacci'
  | 'modified-fibonacci'
  | 't-shirt-sizes'
  | 'powers-of-2'

export type CardVisibility = 'owner-only' | 'all-players'

export interface GameSettings {
  votingSystem: VotingSystem
  cardVisibility: CardVisibility
  autoReveal: boolean
  password?: string
}

export interface Player {
  id: string
  name: string
  vote?: string | null
}

export interface Game {
  id: string
  ownerId: string
  settings: GameSettings
  players: Player[]
  createdAt: Date
  revealed: boolean
}

export type Room = Game
