import React from 'react'
import { useForm } from "react-hook-form"
import { useSingleRoom } from "@/services/querys"
import { useAddMember } from '@/services/mutations'
import { createRoomMemberType, createRoomMemberSchema } from "@/utils/type"
import { zodResolver } from "@hookform/resolvers/zod"

type AddPleyerProps = {
    openAdd: boolean,
    setOpenAdd: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
}


const AddPlayerDialog = ({ openAdd, setOpenAdd, id }: AddPleyerProps) => {
    const { data } = useSingleRoom(id)
    const AddPlayerMutate = useAddMember()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, } = useForm<createRoomMemberType>({
        resolver: zodResolver(createRoomMemberSchema),
        defaultValues: {
            name: "",
            emailAddress: "",
            role: "user",
        }
    }

    )

    function onSubmit(values: createRoomMemberType) {
        AddPlayerMutate.mutate({ values, id })
        setOpenAdd(false)
    }

    return (
        <dialog open={openAdd} className="modal"> {/* Stelle sicher, dass open Attribute hier ist */}
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    <button onClick={() => setOpenAdd(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Game Name : {data?.name}</h3>
                <p className="py-4 text-xl font-bold">insert new Player to this game</p>
                <form onSubmit={handleSubmit(onSubmit)} method="dialog">
                    <div className='grid lg:grid-cols-2 gap-10'>
                        <label className="form-control w-full max-w-xl">
                            <div className="label">
                                <span className="label-text text-xl">Player Email</span>
                            </div>
                            <input defaultValue={data?.name} {...register("emailAddress")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xl" />
                            {errors.emailAddress && <div className="text-red-500">{errors.emailAddress?.message}</div>}

                        </label>
                        <label className="form-control w-full max-w-xl">
                            <div className="label">
                                <span className="label-text text-xl">Player Name</span>
                            </div>
                            <input defaultValue={data?.name} {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xl" />
                            {errors.name && <div className="text-red-500">{errors.name?.message}</div>}

                        </label>
                    </div>
                    <button className="btn btn-secondary mt-5 min-w-24">Add Player</button>
                </form>
            </div>
        </dialog>
    )
}

export default AddPlayerDialog