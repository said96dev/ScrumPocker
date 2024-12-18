'use client'

import React, { useState } from 'react'
import { useGetRooms } from '@/services/querys'
import ActionButtonGroup from './ActionButtonGroup'
import Link from 'next/link'
import ButtonContainer from './ComplexButtonContainer'
import DeleteDialog from './DeleteDialog'
import { RoomListSkeleton } from './TableSkeleton'
import { useDeleteRooms } from '@/services/mutations'
import { RoomCard } from './room-card'
import { NoGamesFound } from './NoGamesFound'
const RoomList = () => {
  const { data, isPending } = useGetRooms()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]) // State für ausgewählte Checkboxen
  const { mutate } = useDeleteRooms()
  const handleDelete = (id: string) => {
    setOpenDelete(!openDelete)
    setRoomId(id)
  }
  const handleShare = (id: string) => {
    setOpenEdit(!openEdit)
    setRoomId(id)
  }
  const handleSelectRoom = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRooms((prev) => [...prev, id])
    } else {
      setSelectedRooms((prev) => prev.filter((roomId) => roomId !== id))
    }
  }
  if (isPending) return <RoomListSkeleton />
  const rooms = data?.rooms || []
  if (rooms?.length < 1) return <NoGamesFound />
  const page = data?.page || 0
  const totlaPages = data?.totalPages || 0
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onDelete={handleDelete} />
      ))}
      <div className='overflow-x-auto sr-only'>
        <table className='table w-full h-full bg-base-100'>
          {/* Table Header */}
          <thead className='w-full'>
            <tr className='text-xl text-left h-[8vh]'>
              <th></th>
              <th>Game&apos;s name</th>
              <th>Players number</th>
              <th>Created by</th>
              <th>
                {selectedRooms.length > 1 && (
                  <div className='flex justify-end'>
                    <button
                      className='btn btn-sm btn-outline btn-error'
                      onClick={() => mutate(selectedRooms)}
                    >
                      Delete Selected Games
                    </button>
                  </div>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.rooms.map((room, index) => (
              <tr key={room.id}>
                <th>
                  <label>
                    <input
                      type='checkbox'
                      className='checkbox'
                      checked={selectedRooms.includes(room.id)}
                      onChange={(e) =>
                        handleSelectRoom(room.id, e.target.checked)
                      }
                    />
                  </label>
                </th>
                <td className='pl-4 capitalize'>
                  <Link href={`room/${room.id}`} className='text-l'>
                    {room.name}
                  </Link>
                </td>
                <td>
                  <span className='text-primary text-l font-bold'>
                    {room.roomMembers?.length}
                  </span>
                </td>
                <td>
                  <div className='flex items-center gap-3'>
                    <div className='avatar placeholder'>
                      <div className='bg-neutral text-neutral-content rounded-full w-12'>
                        <span>
                          {room?.emailAddress?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {room.emailAddress}
                  </div>
                </td>
                <td className=''>
                  <ActionButtonGroup
                    onShare={() => handleShare(room.id)}
                    onDelete={() => handleDelete(room.id)}
                    onEdit={() => handleDelete(room.id)}
                  />
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rooms.length > 4 || page != 1 ? (
        <div className='self-start w-full   rounded-lg'>
          <ButtonContainer currentPage={page} totalPages={totlaPages} />
        </div>
      ) : (
        <></>
      )}

      {/*     {openEdit && (
        <EditDialog openEdit={openEdit} setOpenEdit={setOpenEdit} id={roomId} />
      )} */}

      {openDelete && (
        <DeleteDialog
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          id={roomId}
        />
      )}
    </div>
  )
}

export default RoomList
