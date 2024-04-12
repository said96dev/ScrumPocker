import React from 'react'
import { useForm } from "react-hook-form"
import { useSingleRoom } from "@/services/querys"

type EditProps = {
    openEdit: boolean,
    setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
}


const EditDialog = ({ openEdit, setOpenEdit, id }: EditProps) => {
    const { data } = useSingleRoom(id)
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, } = useForm(
        {
            defaultValues: {
                memberEmail: data?.name,
                memberName: data?.name,
            }
        }
    )

    return (
        <dialog open={openEdit} className="modal"> {/* Stelle sicher, dass open Attribute hier ist */}
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    <button onClick={() => setOpenEdit(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Game Name : {data?.name}</h3>
                <p className="py-4 text-xl font-bold">insert new member to this game</p>
                <form method="dialog">
                    <div className='grid lg:grid-cols-2 gap-10'>
                        <label className="form-control w-full max-w-xl">
                            <div className="label">
                                <span className="label-text text-xl">Member Email</span>
                            </div>
                            <input defaultValue={data?.name} {...register("memberEmail")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xl" />
                            {errors.memberEmail && <div className="text-red-500">{errors.memberEmail?.message}</div>}

                        </label>
                        <label className="form-control w-full max-w-xl">
                            <div className="label">
                                <span className="label-text text-xl">Member Name</span>
                            </div>
                            <input defaultValue={data?.name} {...register("memberName")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xl" />
                            {errors.memberName && <div className="text-red-500">{errors.memberName?.message}</div>}

                        </label>
                    </div>
                    <button onClick={() => setOpenEdit(false)} className="btn btn-secondary mt-5 min-w-24">Add</button>
                </form>
            </div>
        </dialog>
    )
}

export default EditDialog