import React from 'react'
import RoomList from "@/components/RoomList"
import SearchForm from '@/components/SearchForm'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { getRoomsAction } from '@/utils/action'
async function RoomPage() {

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['rooms', "", "", 1],
        queryFn: () => getRoomsAction({}),
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <div className='h-screen'>
                <SearchForm />
                <RoomList />
            </div>
        </HydrationBoundary>)
}

export default RoomPage