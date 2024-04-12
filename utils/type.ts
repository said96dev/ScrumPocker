import * as z from 'zod';


export type RoomType = {
    id: string;
    name: string;
    type: string;
    controller: string;
    autoRevealCards: boolean;
    showAveraging: boolean;
    emailAddress?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    roomMember?: Array<RoomMember>;
}

export enum type {
    Tshirts = "T-shirts(XS,S,M,L,XL)",
    ModifiedFibonacci = "Modified Fibonacci ( 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ? )",
    Fibonacci = "Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ? )",
    PowersOf2 = "Powers of 2( 0, 1, 2, 4, 8, 16, 32, 64, ? )"
}

export type SearchType = {
    search?: string;
    createdByMe?: any;
    page?: number;
    limit?: string;
}

export enum controller {
    AllPlayers = "All Players",
    JustMe = "Just me"
}

export enum Role {
    user = "user",
    admin = "admin"
}

export type RoomMember = {

    name: string;
    emailAddress: string;
    role: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    roomId: string;
    id: string;
    userId: string;
    vote?: string;
}


export const createRoomMemberSchema = z.object({
    name: z.string().min(4, {
        message: "Name must be at least 4 characters long"
    }), emailAddress: z.string().email({ message: "Invalid email address" }),
    role: z.string(),
})
export type createRoomMemberType = z.infer<typeof createRoomMemberSchema>



export const createAndEditRoomSchema = z.object({
    name: z.string().min(4, {
        message: "Name must be at least 4 characters long"
    }),
    type: z.nativeEnum(type),
    controller: z.nativeEnum(controller),
    autoRevealCards: z.boolean(),
    showAveraging: z.boolean(),
    emailAddress: z.string().email({ message: "Invalid email address" }).optional()
});


export type createAndEditRoomType = z.infer<typeof createAndEditRoomSchema>
