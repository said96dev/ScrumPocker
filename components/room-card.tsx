'use client'
import Link from 'next/link'
import { Trash2, Users } from 'lucide-react'
import ActionButtonGroup from './ActionButtonGroup'
import { useState } from 'react'
import ShareDialog from './ShareDialog'
import DeleteDialog from './DeleteDialog'
import { GrUserAdmin } from 'react-icons/gr'
import EditDialog from './EditDialog'

interface RoomCardProps {
  room: any
  onDelete: (id: string) => void
}

export function RoomCard({ room, onDelete }: RoomCardProps) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openShare, setOpenShare] = useState(false)
  const [roomId, setRoomId] = useState('')

  const handleDelete = (id: string) => {
    setOpenDelete(!openDelete)
    setRoomId(id)
  }
  const handleShare = (id: string) => {
    setOpenShare(!openShare)
    setRoomId(id)
  }
  const handleEdit = (id: string) => {
    setOpenEdit(!openEdit)
    setRoomId(id)
  }
  return (
    <div className='card bg-base-100'>
      <div className='card-body'>
        <div className='flex justify-between items-center'>
          <h3 className='card-title'>Room #{room.name}</h3>
          <ActionButtonGroup
            onShare={() => handleShare(room.id)}
            onDelete={() => handleDelete(room.id)}
            onEdit={() => handleEdit(room.id)}
          />
        </div>
        <div className='space-y-2'>
          <p className='text-sm'>System: {room.votingSystems[0].voting.name}</p>
          <div className='flex items-center gap-1 text-sm'>
            <Users className='h-4 w-4' />
            <span>
              {' '}
              {room.roomMembers?.length} {''}
              players
            </span>
          </div>
          <div className='flex items-center gap-1 text-sm'>
            <GrUserAdmin className='h-4 w-4' />
            <span> Admin: {room?.emailAddress}</span>
          </div>
        </div>
        <div className='card-actions justify-end mt-4'>
          <Link href={`room/${room.id}`} className='btn btn-primary btn-sm'>
            Join Room
          </Link>
        </div>
      </div>
      {openShare && (
        <ShareDialog
          openShare={openShare}
          setOpenShare={setOpenShare}
          id={roomId}
        />
      )}

      {openDelete && (
        <DeleteDialog
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          id={roomId}
        />
      )}
      {openEdit && (
        <EditDialog
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          id={roomId}
          room={room}
        />
      )}
    </div>
  )
}
