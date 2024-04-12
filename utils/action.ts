"use server"
import { currentUser } from "@clerk/nextjs"
import {
    RoomType, SearchType, createAndEditRoomType, createRoomMemberType, RoomMember
} from "./type"
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Pusher from 'pusher';

const prisma = new PrismaClient();

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: "eu",
    useTLS: true
});

async function authenticateAndRedirect(): Promise<any> {
    const user = await currentUser();
    if (!user) redirect('/')
    return user
}

export async function createRoomAction(values: createAndEditRoomType): Promise<RoomType | null> {
    const { id: userId, emailAddresses, firstName } = await authenticateAndRedirect();
    const emailAddress = emailAddresses[0]?.emailAddress || "";
    const AdminName = firstName || "";

    try {
        const room = await prisma.room.create({
            data: {
                ...values,
                clerkId: userId,
                emailAddress: emailAddress,
                roomMember: {
                    create: [
                        {
                            emailAddress: emailAddress,
                            role: "admin",
                            name: AdminName,
                            vote: "--",
                            userId,
                        },
                    ]
                }
            }
        });
        return room;
    } catch (error) {
        console.error("Fehler beim Erstellen des Admins:", error);
        return null;
    }
}

export async function getRoomsAction(values: SearchType): Promise<{
    rooms: RoomType[];
    count: number;
    page: number;
    totalPages: number;
}> {
    try {
        const { id: userId, emailAddresses } = await authenticateAndRedirect();
        const emailAddress = emailAddresses[0]?.emailAddress || "";
        let whereClause: Prisma.RoomWhereInput = {
            OR: [
                { roomMember: { some: { emailAddress: emailAddress } } }
            ]
        }

        if (values.search) {
            whereClause = {
                ...whereClause,
                name: values.search
            }
        }

        const page = Number(values.page) || 1;
        const limit = Number(values.limit) || 5;
        const skip = (page - 1) * limit;

        const rooms = await prisma.room.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            include: {
                roomMember: true,
            }
        })

        const count = await prisma.room.count({
            where: whereClause
        })

        const totalPages = Math.ceil(count / limit)

        return { rooms, count, page, totalPages }
    } catch (error) {
        return { rooms: [], count: 0, page: 1, totalPages: 0 }
    }
}


export async function getSingleRoomAction(id: string): Promise<RoomType | null> {
    try {
        const { id: userId } = await authenticateAndRedirect()
        const room = await prisma.room.findUnique({
            where: {
                id: id,
            }, include: {
                roomMember: true,
            }
        })
        return room
    } catch (error) {
        redirect("/room")
    }
}

export async function deleteRoomAction(id: string): Promise<RoomType | null> {
    try {
        //const { id: userId } = await authenticateAndRedirect();
        const room = await prisma.room.findUnique({
            where: {
                id,
            },
        });

        if (!room) {
            throw new Error('Room not found.');
        }

        /*     if (room.clerkId !== userId) {
                throw new Error('Unauthorized to delete this room.');
            } */

        await prisma.roomMember.deleteMany({
            where: {
                roomId: id,
            },
        });

        const deletedRoom = await prisma.room.delete({
            where: {
                id,
            },
        });
        return deletedRoom;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function AddRoomMember(variables: { values: createRoomMemberType, id: string }): Promise<RoomMember | null> {
    const { id, values } = variables;

    try {
        const { id: userId } = await authenticateAndRedirect()
        const member = await prisma.roomMember.findFirst({
            where: {
                emailAddress: values.emailAddress,
                roomId: id
            }
        })
        if (member) throw new Error("email is already in use")

        const memberRole = await prisma.roomMember.findFirst({
            where: {
                userId: userId,
                roomId: id
            }
        })
        if (memberRole?.role != "admin") throw new Error("Invalid role")

        const addRoomMember = await prisma.roomMember.create({
            data: {
                ...values,
                roomId: id,
                userId: userId,
                vote: "--"
            }
        })
        return addRoomMember
    } catch (error) {
        console.log(error)
        return null

    }

}

export async function UpdateVote(variables: { roomId: string, value: string }): Promise<RoomMember | null> {

    try {
        const { emailAddresses } = await authenticateAndRedirect();
        const emailAddress = emailAddresses[0]?.emailAddress || ""; const { roomId, value } = variables
        const roomMember = await prisma.roomMember.findFirst({
            where: {
                emailAddress: emailAddress,
                roomId: roomId,
            }
        })
        if (!roomMember) throw new Error("Invalid room member")
        const vote = await prisma.roomMember.update({
            where: {
                id: roomMember.id,
                roomId: roomId,
            },
            data: {
                vote: value,
            },
        });
        await pusher.trigger(`vote-channel-${roomId}`, 'vote-updated', {
            roomId: roomId,
            vote: value,
        });
        return vote
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function DeleteVote(id: string): Promise<RoomMember[] | null> {
    try {
        const updateResult = await prisma.roomMember.updateMany({
            where: {
                roomId: id,
            },
            data: {
                vote: "--",
            },
        });

        if (updateResult.count > 0) {
            const updatedMembers = await prisma.roomMember.findMany({
                where: {
                    roomId: id,
                },
            });
            await pusher.trigger(`vote-channel-${id}`, 'vote-updated', {
                roomId: id,
                vote: "--",
            });
            return updatedMembers;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error updating votes:", error);
        return null; // Fehlerfall
    }
}
