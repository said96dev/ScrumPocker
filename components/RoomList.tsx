"use client"

import React, { useState } from 'react'
import { useGetRooms } from '@/services/querys'
import ActionButtonGroup from './ActionButtonGroup';
import Link from "next/link"
import EditDialog from './EditDialog';
import ButtonContainer from './ComplexButtonContainer';
import DeleteDialog from './DeleteDialog';
import AddPlayerDialog from './AddPlayerDialog';
const RoomList = () => {
    const { data, isPending } = useGetRooms()
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)
    const [roomId, setRoomId] = useState("")
    const handleDelete = (id: string) => {
        setOpenDelete(!openDelete)
        setRoomId(id)

    }
    const handleEdit = (id: string) => {
        setOpenEdit(!openEdit)
        setRoomId(id)
    }

    const handleAdd = (id: string) => {
        setOpenAdd(!openAdd)
        setRoomId(id)
    }

    if (isPending) return <h2 className='text-xl'>Please wait...</h2>;
    const rooms = data?.rooms || []
    if (rooms?.length < 1) return <h2 className='text-xl'>No Game&apos;s Found...</h2>;
    const page = data?.page || 0
    const totlaPages = data?.totalPages || 0
    return (
        <div className='flex flex-col gap-10'>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* Table Header */}
                    <thead>
                        <tr className='text-xl'>

                            <th>Game&apos;s name</th>
                            <th>
                                Players number
                            </th>
                            <th>Created by</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.rooms.map((room, index) => (
                            <tr key={room.id}>
                                <td className="pl-4 capitalize">
                                    <Link href={`room/${room.id}`} className='text-l'>
                                        {room.name}
                                    </Link>

                                </td>
                                <td><span className='text-primary text-l font-bold'>
                                    {room.roomMember?.length}
                                </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-12">
                                                <span>{room?.emailAddress?.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                        </div>
                                        {room.emailAddress}
                                    </div>

                                </td>
                                <td>
                                    <ActionButtonGroup
                                        onAdd={() => handleAdd(room.id)}
                                        onEdit={() => handleEdit(room.id)}
                                        onDelete={() => handleDelete(room.id)}
                                    />
                                </td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {
                rooms.length > 4 || page != 1 ? <div className='self-center'>
                    <ButtonContainer currentPage={page} totalPages={totlaPages} />
                </div> : <></>
            }

            {
                openEdit && (
                    <EditDialog openEdit={openEdit} setOpenEdit={setOpenEdit} id={roomId} />
                )
            }

            {
                openDelete && (
                    <DeleteDialog openDelete={openDelete} setOpenDelete={setOpenDelete} id={roomId} />
                )
            }
            {
                openAdd && (
                    <AddPlayerDialog openAdd={openAdd} setOpenAdd={setOpenAdd} id={roomId} />
                )
            }
        </div>
    )
}

export default RoomList