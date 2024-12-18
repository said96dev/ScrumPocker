'use client'

import { useState } from 'react'
import { useSingleRoom } from '@/services/querys'
import { MdContentCopy } from 'react-icons/md'
import { toast } from 'sonner'

interface ShareDialogProps {
  openShare: boolean
  setOpenShare: (open: boolean) => void
  id: string
}

function ShareDialog({ openShare, setOpenShare, id }: ShareDialogProps) {
  const { data } = useSingleRoom(id)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/room/join/${id}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 4000)
  }

  if (!openShare) return null

  return (
    <dialog open={openShare} className='modal modal-open'>
      <div className='modal-box w-11/12 max-w-2xl bg-base-100'>
        <form method='dialog'>
          <button
            onClick={() => setOpenShare(false)}
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
          >
            ✕
          </button>
        </form>

        <h3 className='font-bold text-2xl mb-6'>Share Game: {data?.name}</h3>

        <div className='space-y-4'>
          <div>
            <label className='label'>
              <span className='label-text text-base font-medium'>
                Share Link
              </span>
            </label>
            <p className='text-sm opacity-70 mb-2'>
              Anyone with this link will be able to view this game
            </p>
            <div className='join w-full'>
              <input
                readOnly
                value={shareUrl}
                className='input input-bordered join-item flex-1 font-mono text-sm'
              />
              <button
                onClick={handleCopy}
                className={`btn join-item ${
                  copied ? 'btn-success' : 'btn-secondary'
                }`}
              >
                <MdContentCopy className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        <div id='toast-success' className='toast toast-top toast-end hidden'>
          <div className='alert alert-success'>
            <span>Link copied to clipboard!</span>
          </div>
        </div>

        {/* Error Toast */}
        <div id='toast-error' className='toast toast-top toast-end hidden'>
          <div className='alert alert-error'>
            <span>Failed to copy link</span>
          </div>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button onClick={() => setOpenShare(false)}>close</button>
      </form>
    </dialog>
  )
}

export default ShareDialog
