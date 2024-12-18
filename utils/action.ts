'use server'
import { currentUser } from '@clerk/nextjs'
import {
  RoomType,
  SearchType,
  createAndEditRoomType,
  createRoomMemberType,
  RoomMember,
  SessionData,
} from './type'
import { Prisma } from '@prisma/client'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { EditRoomType } from './editRoomSchema'

const prisma = new PrismaClient()

export async function authenticateAndRedirect(): Promise<any> {
  const user = await currentUser()
  if (!user) redirect('/')
  return user
}

export async function GetCurrentUser(): Promise<any> {
  const user = await currentUser()
  if (user)
    return { user: user.emailAddresses[0].emailAddress, name: user.firstName }
  return
}

export async function GetCurrentPlayerById(
  emailAddress: string,
  roomId: string
) {
  const user = await prisma.roomMember.findFirst({
    where: {
      roomId: roomId,
      emailAddress: emailAddress,
    },
  })
  return user
}
export async function createRoomAction(values: createAndEditRoomType) {
  const {
    id: userId,
    emailAddresses,
    firstName,
  } = await authenticateAndRedirect()

  const emailAddress = emailAddresses[0]?.emailAddress || ''
  const AdminName = firstName || ''

  try {
    // Hash das Passwort
    const saltRounds = 10 // Bestimmt die Komplexität des Hashs (je höher, desto sicherer aber langsamer)
    const hashedPassword = await bcrypt.hash(values.hashedPassword, saltRounds)
    // Prisma-Operation zum Erstellen eines neuen Raums
    const room = await prisma.room.create({
      data: {
        name: values.name,
        controller: values.controller,
        autoRevealCards: values.autoRevealCards,
        showAveraging: values.showAveraging,
        reset: values.reset,
        hashedPassword: hashedPassword, // Das gehashte Passwort speichern
        clerkId: userId,
        emailAddress: emailAddress,
        roomMembers: {
          create: [
            {
              role: 'ADMIN',
              name: AdminName,
              vote: '--',
              emailAddress: emailAddress,
            },
          ],
        },
        votingSystems: {
          create: [
            {
              voting: {
                connect: { id: values.votingId }, // Verbindung zur Voting-Tabelle
              },
            },
          ],
        },
      },
    })

    return room
  } catch (error) {
    console.error('Fehler beim Erstellen des Raums:', error)
    return null
  }
}
export async function updataRoomAction(values: EditRoomType) {
  const {
    id: userId,
    emailAddresses,
    firstName,
  } = await authenticateAndRedirect()

  const emailAddress = emailAddresses[0]?.emailAddress || ''

  try {
    const findRoomAndUpdate = await prisma.room.findFirst({
      where: {
        id: values.roomId,
        emailAddress: emailAddress,
        clerkId: userId,
      },
    })
    if (!findRoomAndUpdate) {
      throw new Error('Sie sind nicht berechtigt, diesen Raum zu bearbeiten.')
    }
    const updateRoom = await prisma.room.update({
      where: { id: values.roomId },
      data: {
        name: values.name,
        controller: values.controller,
        autoRevealCards: values.autoRevealCards,
        showAveraging: values.showAveraging,
        reset: values.reset,
        votingSystems: {
          updateMany: {
            where: {
              roomId: values.roomId,
            },
            data: {
              votingId: values.votingId,
            },
          },
        },
      },
    })

    return updateRoom
  } catch (error) {
    console.error('Fehler beim Erstellen des Raums:', error)
    return null
  }
}

export async function getRoomsAction(values: SearchType) {
  try {
    const { id: userId, emailAddresses } = await authenticateAndRedirect()
    const emailAddress = emailAddresses[0]?.emailAddress || ''
    let whereClause: Prisma.RoomWhereInput = {
      OR: [{ emailAddress: emailAddress }],
    }

    if (values.search) {
      whereClause = {
        ...whereClause,
        name: {
          contains: values.search, // "contains" erlaubt Teilübereinstimmungen
          mode: 'insensitive', // Sucht unabhängig von Groß- und Kleinschreibung
        },
      }
    }

    const page = Number(values.page) || 1
    const limit = Number(values.limit) || 5
    const skip = (page - 1) * limit

    const rooms = await prisma.room.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      include: {
        roomMembers: true,
        votingSystems: {
          // Inklusive zugehöriger Voting-Daten
          include: {
            voting: true, // Voting-Details wie Werte und Name
          },
        },
      },
    })

    const count = await prisma.room.count({
      where: whereClause,
    })

    const totalPages = Math.ceil(count / limit)

    return { rooms, count, page, totalPages }
  } catch (error) {
    return { rooms: [], count: 0, page: 1, totalPages: 0 }
  }
}

export async function getSingleRoomAction(id: string) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        roomMembers: true,
        votingSystems: {
          // Inklusive zugehöriger Voting-Daten
          include: {
            voting: true, // Voting-Details wie Werte und Name
          },
        },
      },
    })
    return room
  } catch (error) {
    console.log(error)
    redirect('/')
  }
}

export async function deleteRoomAction(id: string) {
  try {
    //const { id: userId } = await authenticateAndRedirect();
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!room) {
      throw new Error('Room not found.')
    }

    /*     if (room.clerkId !== userId) {
                throw new Error('Unauthorized to delete this room.');
            } */

    await prisma.roomMember.deleteMany({
      where: {
        roomId: id,
      },
    })

    const deletedRoom = await prisma.room.delete({
      where: {
        id,
      },
    })
    return deletedRoom
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function AddRoomMember(variables: {
  values: createRoomMemberType
  id: string
}) {
  const { id, values } = variables

  try {
    const member = await prisma.roomMember.findFirst({
      where: {
        emailAddress: values.emailAddress,
        roomId: id,
      },
    })
    if (member) throw new Error('email is already in use')

    const addRoomMember = await prisma.roomMember.create({
      data: {
        ...values,
        roomId: id,
        vote: '--',
        role: 'USER',
      },
    })
    return addRoomMember
  } catch (error) {
    // Log and handle errors appropriately
    console.error('Error adding room member:', error)

    // Handle different types of errors gracefully
    if (error instanceof Error) {
      return { success: false, message: error.message }
    }

    return { success: false, message: 'An unknown error occurred.' }
  }
}

export async function UpdateVote(variables: {
  session: SessionData
  value: string
}) {
  try {
    const { session, value } = variables
    const roomMember = await prisma.roomMember.findFirst({
      where: {
        emailAddress: session.emailAddress,
        roomId: session.roomId,
      },
    })
    if (!roomMember) throw new Error('Invalid room member')
    const vote = await prisma.roomMember.update({
      where: {
        id: roomMember.id,
        roomId: session.roomId,
      },
      data: {
        vote: value,
      },
    })
    return vote
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function DeleteVote(id: string) {
  try {
    const updateResult = await prisma.roomMember.updateMany({
      where: {
        roomId: id,
      },
      data: {
        vote: '--',
      },
    })

    if (updateResult.count > 0) {
      const updatedMembers = await prisma.roomMember.findMany({
        where: {
          roomId: id,
        },
      })

      return updatedMembers
    } else {
      return null
    }
  } catch (error) {
    console.error('Error updating votes:', error)
    return null // Fehlerfall
  }
}

export async function GetVotingSystems() {
  try {
    const VotingSystems = await prisma.voting.findMany({})
    return VotingSystems
  } catch (error) {
    redirect('/')
  }
}

export async function deleteRoomsAction(rooms: string[]) {
  try {
    const existingRooms = await prisma.room.findMany({
      where: {
        id: {
          in: rooms, // Verwende "in", um mehrere IDs zu filtern
        },
      },
    })

    if (existingRooms.length === 0) {
      throw new Error('No matching rooms found.')
    }

    await prisma.roomMember.deleteMany({
      where: {
        roomId: {
          in: rooms, // Löscht Mitglieder in allen angegebenen Räumen
        },
      },
    })

    const deletedRooms = await prisma.room.deleteMany({
      where: {
        id: {
          in: rooms, // Löscht alle Räume mit den angegebenen IDs
        },
      },
    })
    return deletedRooms
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deletePlayersAction(playerId: string, roomId: string) {
  const { id: userId, emailAddresses } = await authenticateAndRedirect()
  try {
    const existingRooms = await prisma.room.findMany({
      where: {
        id: roomId,
      },
    })
    if (
      existingRooms.length === 0 ||
      existingRooms[0].emailAddress !== emailAddresses[0].emailAddress ||
      existingRooms[0].clerkId !== userId
    ) {
      throw new Error('No matching rooms found.')
    }

    const deleteplayer = await prisma.roomMember.deleteMany({
      where: {
        roomId: roomId,
        id: Number(playerId),
      },
    })

    return deleteplayer
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function resetVotes(roomId: string) {
  try {
    const updateResult = await prisma.roomMember.updateMany({
      where: {
        roomId: roomId,
      },
      data: {
        vote: '--',
      },
    })
    return updateResult
  } catch (error) {
    console.error('Error updating votes:', error)
    return null // Fehlerfall
  }
}
