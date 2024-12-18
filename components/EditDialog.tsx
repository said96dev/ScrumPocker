'use client'

import { useSingleRoom } from '@/services/querys'
import CreateGameForm from './CreateGameForm'
import { EditRoomType } from '@/utils/editRoomSchema'
import { useUpdateRoom } from '@/services/mutations'

interface EditDialogProps {
  openEdit: boolean
  setOpenEdit: (open: boolean) => void
  id: string
  room: any
  EditRoomSettingsHandler?: () => void
}

function EditDialog({
  openEdit,
  setOpenEdit,
  id,
  room,
  EditRoomSettingsHandler,
}: EditDialogProps) {
  const { data } = useSingleRoom(id)
  const editMutate = useUpdateRoom()

  const EditRoomSettings = async (
    updatedSettings: EditRoomType,
    id: string
  ) => {
    // Added id parameter
    try {
      await editMutate.mutateAsync(updatedSettings)
      EditRoomSettingsHandler && EditRoomSettingsHandler()
    } catch (error) {
      console.error('Error updating room settings:', error)
    }
  }
  if (!openEdit) return null

  return (
    <dialog open={openEdit} className='modal modal-open'>
      <div className='modal-box w-11/12 max-w-2xl bg-base-100'>
        <form method='dialog'>
          <button
            onClick={() => setOpenEdit(false)}
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
          >
            ✕
          </button>
        </form>

        <h3 className='font-bold text-2xl mb-6'>Edit Game: {data?.name}</h3>

        <CreateGameForm
          mode='edit'
          value={room}
          setOpenEdit={setOpenEdit}
          EditRoomSettings={EditRoomSettings}
        />
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button onClick={() => setOpenEdit(false)}>close</button>
      </form>
    </dialog>
  )
}

export default EditDialog
