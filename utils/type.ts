import * as z from 'zod'
import { NextApiResponse } from 'next'
import { Server as NetServer, Socket } from 'net'
import { Server as SocketIOServer } from 'socket.io'
export type RoomType = {
  id: string
  name: string
  type: string
  controller: string
  autoRevealCards: boolean
  showAveraging: boolean
  emailAddress?: string
  createdAt?: Date | null
  updatedAt?: Date | null
  roomMember?: Array<RoomMember>
}

export enum type {
  Tshirts = 'T-shirts(XS,S,M,L,XL)',
  ModifiedFibonacci = 'Modified Fibonacci ( 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ? )',
  Fibonacci = 'Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ? )',
  PowersOf2 = 'Powers of 2( 0, 1, 2, 4, 8, 16, 32, 64, ? )',
}

export type SearchType = {
  search?: string
  createdByMe?: any
  page?: number
  limit?: string
}

export enum controller {
  AllPlayers = 'All Players',
  JustMe = 'Just me',
}

export enum Role {
  user = 'USER',
  admin = 'ADMIN',
}

export type RoomMember = {
  name: string
  emailAddress: string
  role: string
  createdAt?: Date | null
  updatedAt?: Date | null
  roomId: string
  id: string
  userId: string
  vote?: string
}

export const createRoomMemberSchema = z.object({
  name: z.string().min(4, {
    message: 'Name must be at least 4 characters long',
  }),
  role: z.string(),
  emailAddress: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
})
export type createRoomMemberType = z.infer<typeof createRoomMemberSchema>

export const createAndEditRoomSchema = z.object({
  name: z.string().min(4, {
    message: 'Name must be at least 4 characters long',
  }),
  votingId: z.coerce.number(),
  controller: z.nativeEnum(controller),
  autoRevealCards: z.boolean(),
  showAveraging: z.boolean(),
  emailAddress: z
    .string()
    .email({ message: 'Invalid email address' })
    .optional(),
  hashedPassword: z
    .string()
    .min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  roomId: z.string().optional(),
  reset: z.nativeEnum(controller),
})

export type createAndEditRoomType = z.infer<typeof createAndEditRoomSchema>

export const createGameSchema = z.object({
  votingSystem: z.enum([
    'fibonacci',
    'modified-fibonacci',
    't-shirt-sizes',
    'powers-of-2',
  ]),
  cardVisibility: z.enum(['owner-only', 'all-players']),
  autoReveal: z.boolean(),
  password: z.string().min(4).max(50),
})

export const joinGameSchema = z.object({
  name: z.string().min(2).max(50),
  password: z.string().min(4).max(50),
  emailAddress: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
})

export type CreateGameInput = z.infer<typeof createGameSchema>
export type JoinGameInput = z.infer<typeof joinGameSchema>

export interface SessionData {
  name: string
  roomId: string
  emailAddress: string
  role: Role
  joinedAt: number
}

// Session configuration
export const SESSION_EXPIRY_HOURS = 24 // Session expires after 24 hours
