'use client'

import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PlayerContainer from '@/components/PlayerContainer'
import { useSession } from '@/Hooks/useSession'
import {
  useGetCurrentPlayerById,
  useGetCurrentUser,
  useSingleRoom,
} from '@/services/querys'
import { useChannel } from '@/utils/ably'
import * as Ably from 'ably'
import LoadingSpinner from '@/components/loading'

export default function SingleRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { session, isLoading: sessionLoading, getSessions } = useSession()
  const { data: user, isLoading: userLoading } = useGetCurrentUser()
  useEffect(() => {
    const currentSession = getSessions(user, params.id)
    if (!currentSession) {
      router.push(`/room/join/${params.id}`)
    }
  }, [params.id, userLoading, user])

  const isLocalStorageAvailable =
    typeof window !== 'undefined' && window.localStorage
  const userexits = isLocalStorageAvailable
    ? localStorage.getItem('gameSession')
    : false
  const isValidForRoom = userexits ? JSON.parse(userexits) : false
  if (user && user.user !== isValidForRoom?.emailAddress) {
    router.push(`/room/join/${params.id}`)
  }
  if (isValidForRoom.roomId === params.id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { refetch } = useSingleRoom(params.id)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const playerChannel = useChannel(
      // eslint-disable-next-line react-hooks/rules-of-hooks
      `room:${params.id}:players`,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useCallback(
        (message: Ably.Message) => {
          if (message.name === 'player_update') {
            refetch()
          }
        },
        [refetch]
      )
    )
    playerChannel.publish('player_update', {
      action: 'add',
    })
  }
  if (sessionLoading) {
    return <LoadingSpinner />
  }
  if (session) return <PlayerContainer params={params} />
}
