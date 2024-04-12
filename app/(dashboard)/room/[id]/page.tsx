import React from 'react'
import PlayerContainer from '@/components/PlayerContainer'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { getSingleRoomAction } from '@/utils/action'
async function SingleRoomPage({ params }: { params: { id: string } }) {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ['singleRoom', params.id],
        queryFn: () => getSingleRoomAction(params.id),
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PlayerContainer params={params} />
        </HydrationBoundary>

    )
}

export default SingleRoomPage