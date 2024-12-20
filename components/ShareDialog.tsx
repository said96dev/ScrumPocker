'use client'

import { useState } from 'react'
import { useSingleRoom } from '@/services/querys'
import { MdContentCopy } from 'react-icons/md'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

interface ShareDialogProps {
  openShare: boolean
  setOpenShare: (open: boolean) => void
  id: string
}

function ShareDialog({ openShare, setOpenShare, id }: ShareDialogProps) {
  const { data } = useSingleRoom(id)
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('123456')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
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
        <div className='mb-4'>
          <label className='label'>
            <span className='label-text text-base font-medium'>
              Spiel-Passwort
            </span>
          </label>
          <p className='text-sm opacity-70 mb-2'>
            Deine Teammitglieder benötigen dieses Passwort, um dem Spiel
            beizutreten
          </p>
          <div className='flex items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Spiel-Passwort eingeben'
              className='input input-bordered w-full pr-10'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={togglePasswordVisibility}
              className='ml-2 px-3 py-2 bg-secondary text-base-100 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200'
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
