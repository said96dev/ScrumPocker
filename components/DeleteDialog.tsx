import React from 'react'
import { useSingleRoom } from "@/services/querys"
import { useDeleteRoom } from '@/services/mutations'
type DeleteDialog = {
    openDelete: boolean,
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
}


const DeleteDialog = ({ openDelete, setOpenDelete, id }: DeleteDialog) => {
    const { data } = useSingleRoom(id)
    const { mutate, isSuccess } = useDeleteRoom()

    const handleDelete = () => {
        setOpenDelete(false)
        mutate(id)
    }

    return (
        <dialog open={openDelete} className="modal"> {/* Stelle sicher, dass open Attribute hier ist */}
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    <button onClick={() => setOpenDelete(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Game Name : {data?.name}</h3>
                <p className="py-4 text-xl font-bold">Are you sure you want to delete this Game?</p>
                <form method="dialog" className='flex gap-4'>
                    <button onClick={() => setOpenDelete(false)} className="btn btn-base-100 mt-5 min-w-24">cancel</button>
                    <button onClick={handleDelete} className="btn btn-error mt-5 min-w-24">Delete</button>
                </form>
            </div>
        </dialog>
    )
}

export default DeleteDialog