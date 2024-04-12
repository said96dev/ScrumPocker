"use client"

import { useQuery } from '@tanstack/react-query';
import { getRoomsAction, getSingleRoomAction } from "@/utils/action"; // Assuming correct path
import { useSearchParams } from 'next/navigation';

export const useGetRooms = () => {
    const searchParams = useSearchParams()
    const search = searchParams.get('search') || ""
    const createdByMe = searchParams.get('createdByMe')
    const page = Number(searchParams.get('page') || 1)
    return useQuery({
        queryKey: ["rooms", search, createdByMe, page],
        queryFn: () => getRoomsAction({
            search: search,
            createdByMe: createdByMe,
            page
        }),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useSingleRoom = (id: string) => {
    return useQuery({
        queryKey: ["singleRoom", id],
        queryFn: async () => {
            try {
                const data = await getSingleRoomAction(id);
                return data;
            } catch (error) {
                throw new Error("Error fetching single room data");
            }
        },
        staleTime: 1000 * 60 * 10,
    });
}
