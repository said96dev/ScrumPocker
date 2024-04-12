import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddRoomMember, createRoomAction, deleteRoomAction, UpdateVote, DeleteVote } from '@/utils/action'
import { createAndEditRoomType, createRoomMemberType } from '@/utils/type'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

export function useCreateRoom() {
    const router = useRouter()

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: createAndEditRoomType) => createRoomAction(values),
        onSuccess: (data) => {
            if (!data) return "ther was an error"
            queryClient.invalidateQueries({
                queryKey: ["rooms"]
            })
            toast.success('Game created successfully')

            router.push("/room")
        }
    })
}

export function useDeleteRoom() {

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteRoomAction(id),
        onSuccess: (data) => {
            if (!data) return "ther was an error"
            queryClient.invalidateQueries({
                queryKey: ["rooms"]
            })
            toast.success('Game deleted successfully')

        }
    })
}

export function useAddMember() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (variables: { values: createRoomMemberType, id: string }) => AddRoomMember(variables),
        onSuccess: (data) => {
            if (!data) return "ther was an error"
            queryClient.invalidateQueries({
                queryKey: ["rooms"]
            })
            toast.success('New Player added successfully')
        }
    })
}

export function useUpdateVote() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (variables: { roomId: string, value: string }) => UpdateVote(variables),
        onSuccess: (data) => {
            if (!data) return "ther was an error"
            queryClient.invalidateQueries({
                queryKey: ["rooms"]
            })
            queryClient.invalidateQueries({
                queryKey: ["singleRoom"]
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
            if (!data) return "ther was an error"
            queryClient.invalidateQueries({
                queryKey: ["rooms"]
            })
            queryClient.invalidateQueries({
                queryKey: ["singleRoom"]
            })
            toast.success('Vote deleted successfully')
        }
    })
}