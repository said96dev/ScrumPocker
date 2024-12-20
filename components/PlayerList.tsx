import { useSession } from '@/Hooks/useSession'
import { useDeletePlayers } from '@/services/mutations'
import { FaRegTrashAlt } from 'react-icons/fa'
import { VscWorkspaceUnknown } from 'react-icons/vsc'
import * as Ably from 'ably'
import { useChannel } from '@/utils/ably'
import { useCallback } from 'react'

interface PlayerListProps {
  players: any
  revelCards: boolean
  params: string
  refetch: () => void
}

export function PlayerList({
  players,
  revelCards,
  params,
  refetch,
}: PlayerListProps) {
  const { session } = useSession()
  const playerChannel = useChannel(
    `room:${params}:deletePlayers`,
    useCallback(
      (message: Ably.Message) => {
        if (message.name === 'player_update') {
          refetch()
        }
      },
      [refetch]
    )
  )

  const { mutateAsync } = useDeletePlayers()
  const deletePlayer = async (playerId: string) => {
    try {
      await mutateAsync({ playerId, roomId: params })
      await playerChannel.publish('player_update', {
        action: 'delete',
        playerId: playerId,
      })
      refetch() // Call refetch immediately after successful deletion
    } catch (error) {
      console.error('Error deleting player:', error)
    }
  }
  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title'>Players</h2>
        <div className='space-y-4'>
          {players?.map((player: any) => (
            <div
              key={player.id}
              className='flex items-center justify-between p-3 bg-base-200 rounded-lg'
            >
              <div className='flex items-center space-x-3'>
                {session?.role === 'ADMIN' && player.role !== 'ADMIN' && (
                  <button
                    onClick={() => deletePlayer(player.id as string)}
                    className='btn btn-circle btn-ghost btn-xs hover:text-red-600 hover:bg-transparent text-error transition-colors'
                    aria-label={`Delete ${player.name}`}
                  >
                    <FaRegTrashAlt className='h-4 w-4' />
                  </button>
                )}
                <div className='flex flex-col'>
                  <span className='font-medium'>{player.name}</span>
                  <i className='text-xs'>{player.emailAddress}</i>
                </div>
              </div>
              <span className='text-sm'>
                {player.vote === '--' ? (
                  <span className='loading loading-bars loading-xs'></span>
                ) : revelCards ? (
                  player.vote
                ) : (
                  <VscWorkspaceUnknown size={18} />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
