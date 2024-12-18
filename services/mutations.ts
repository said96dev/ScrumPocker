import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AddRoomMember,
  createRoomAction,
  deleteRoomAction,
  UpdateVote,
  DeleteVote,
  deleteRoomsAction,
  deletePlayersAction,
  resetVotes,
  updataRoomAction,
} from '@/utils/action'
import {
  createAndEditRoomType,
  createRoomMemberType,
  SessionData,
} from '@/utils/type'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { EditRoomType } from '@/utils/editRoomSchema'
import { getAblyChannel } from '@/utils/ably'

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: createAndEditRoomType) => createRoomAction(values),
    onSuccess: (data) => {
      if (!data) return 'ther was an error'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      toast.success('Game created successfully')
    },
  })
}

export function useUpdateRoom() {
  const router = useRouter()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: EditRoomType) => updataRoomAction(values),
    onSuccess: (data) => {
      if (!data) return 'ther was an error'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      toast.success('Game updated successfully')
    },
    onError: () => {
      router.push('/my_games')
    },
  })
}
export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRoomAction(id),
    onSuccess: (data) => {
      if (!data) return 'ther was an error'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      toast.success('Game deleted successfully')
    },
  })
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: {
      values: createRoomMemberType
      id: string
    }) => {
      const result = await AddRoomMember(variables)
      if (!result) {
        throw new Error('Failed to add member')
      }
      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['rooms', 'singleRoom'],
      })

      // Publish the new player data to Ably
      const channel = getAblyChannel(`room:${variables.id}:players`)
      channel.publish('player_added', {
        roomId: variables.id,
        player: data,
      })

      toast.success('Player added successfully')
    },
    onError: (error) => {
      console.error('Error adding member:', error)
      toast.error('Failed to add player')
    },
  })
}

export function useUpdateVote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { session: SessionData; value: string }) =>
      UpdateVote(variables),
    onSuccess: (data) => {
      if (!data) return 'ther was an error'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      queryClient.invalidateQueries({
        queryKey: ['singleRoom'],
      })
      toast.success('Vote updated successfully')
    },
  })
}

export function useDeleteVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomId: string) => DeleteVote(roomId),
    onSuccess: (data) => {
      if (!data) return 'ther was an error'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      queryClient.invalidateQueries({
        queryKey: ['singleRoom'],
      })
      toast.success('Vote deleted successfully')
    },
  })
}

export function useDeleteRooms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rooms: string[]) => deleteRoomsAction(rooms),
    onSuccess: (data) => {
      if (!data) return 'ther was an error'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      queryClient.invalidateQueries({
        queryKey: ['singleRoom'],
      })
      toast.success('Game deleted successfully')
    },
  })
}

export function useDeletePlayers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { playerId: string; roomId: string }) =>
      deletePlayersAction(variables.playerId, variables.roomId),
    onSuccess: (data) => {
      if (!data) return 'error deleting player'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      queryClient.invalidateQueries({
        queryKey: ['singleRoom'],
      })
      toast.success('Player deleted successfully')
    },
  })
}

export function useResetVotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomId: string) => resetVotes(roomId),
    onSuccess: (data) => {
      if (!data) return 'error reseting Votes'
      queryClient.invalidateQueries({
        queryKey: ['rooms'],
      })
      queryClient.invalidateQueries({
        queryKey: ['singleRoom'],
      })
      toast.success('Votes reset successfully')
    },
  })
}
