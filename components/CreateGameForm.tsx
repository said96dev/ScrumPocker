"use client"

import React from 'react'
import { useForm } from "react-hook-form"
import { createAndEditRoomSchema, createAndEditRoomType, type, controller } from "@/utils/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateRoom } from '@/services/mutations'
import { BiLoader } from "react-icons/bi";

const CreateGameForm = () => {

    const { mutate, isPending } = useCreateRoom()
    const { register, handleSubmit, formState: { errors } } = useForm<createAndEditRoomType>({
        resolver: zodResolver(createAndEditRoomSchema),
        defaultValues: {
            name: "",
            type: type.Tshirts,
            controller: controller.AllPlayers,
            autoRevealCards: false,
            showAveraging: false,
        }
    })

    function onSubmit(values: createAndEditRoomType) {
        mutate(values)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}
            className='rounded pt-6 pb-8 mb-12 flex justify-center items-center flex-col lg:w-1/2 gap-4'>
            <label className="form-control w-full max-w-xl">
                <div className="label">
                    <span className="label-text text-xl">Game&apos;s name?</span>
                </div>
                <input  {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xl" />
                {errors.name && <div className="text-red-500">{errors.name?.message}</div>}

            </label>
            <label className="form-control w-full max-w-xl">
                <div className="label">
                    <span className="label-text text-xl">Who can reveal cards?</span>
                </div>
                <select {...register("controller")} defaultValue="All Players" className=" select select-bordered w-full max-w-xl">
                    <option>All Players</option>
                    <option>Just me</option>
                </select>
            </label>
            <label className="form-control w-full max-w-xl">
                <div className="label">
                    <span className="label-text text-xl">Voting system</span>
                </div>
                <select {...register("type")} defaultValue="Pick one" className=" select select-bordered w-full max-w-xl">
                    <option disabled>Pick one</option>
                    <option>T-shirts(XS,S,M,L,XL)</option>
                    <option>Modified Fibonacci ( 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ? )</option>
                    <option>Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ? )</option>
                    <option>Powers of 2( 0, 1, 2, 4, 8, 16, 32, 64, ? )</option>
                </select>
            </label>
            <div className="form-control w-full max-w-xl">
                <label className="cursor-pointer label ">
                    <div className='flex flex-col'>
                        <span className="label-text text-xl">Auto-reveal cards
                        </span>
                        <i className='text-base-content'>Show cards automatically after everyone voted.</i>
                    </div>
                    <input {...register("autoRevealCards")} type="checkbox" className="toggle toggle-secondary" onChange={() => console.log("check")} />
                </label>
            </div>
            <div className="form-control w-full max-w-xl">
                <label className="cursor-pointer label ">
                    <div className='flex flex-col'>
                        <span className="label-text text-xl">Show average in the results
                        </span>
                        <i className='text-base-content'>Include the average value in the results of the voting.</i>
                    </div>
                    <input {...register("showAveraging")} type="checkbox" className="toggle toggle-secondary" onChange={() => console.log("check")} />
                </label>
            </div>
            <button type="submit" className="btn btn-secondary" disabled={isPending}> {isPending ? (
                <>
                    <BiLoader className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </>
            ) : (
                'create game'
            )}</button>
        </form>
    )
}

export default CreateGameForm