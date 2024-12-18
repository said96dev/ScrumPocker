'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, User } from 'lucide-react'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { joinGameSchema, JoinGameInput, Role } from '@/utils/type'
import bcrypt from 'bcryptjs'
import { toast } from 'sonner'
import * as Ably from 'ably'

import {
  useGetCurrentPlayerById,
  useGetCurrentUser,
  useSingleRoom,
} from '@/services/querys'
import { useAddMember } from '@/services/mutations'
import { useSession } from '@/Hooks/useSession'
import { useChannel } from '@/utils/ably'

export default function JoinGamePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: user, isLoading: userLoading } = useGetCurrentUser() //clerk user
  const { session, isLoading: sessionLoading, saveSession } = useSession()
  const addMember = useAddMember()
  const {
    data: room,
    isLoading: isRoomLoading,
    error: roomError,
    refetch,
  } = useSingleRoom(params.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinGameInput>({
    resolver: zodResolver(joinGameSchema),
    defaultValues: {
      name: '',
      password: '',
      emailAddress: '',
    },
  })

  const channel = useChannel(
    `room:${params.id}:players`,
    useCallback(
      (message: Ably.Message) => {
        if (message.name === 'player_added') {
          refetch()
        }
      },
      [refetch]
    )
  )

  useEffect(() => {
    if (!userLoading && !isRoomLoading && user && room) {
      if (user.user === room.emailAddress) {
        saveSession({
          name: user.name,
          roomId: params.id,
          emailAddress: room.emailAddress || user.user,
          role: Role.admin,
        })
        router.push(`/room/${params.id}`)
      }
    }
  }, [params.id, user, room, userLoading, isRoomLoading, saveSession, router])

  /*   useEffect(() => {
    if (!sessionLoading && session?.roomId === params.id && !user) {
      console.log('!user')
      router.push(`/room/${params.id}`)
    }
  }, [session, params.id, router, sessionLoading]) */

  async function onSubmit(values: JoinGameInput) {
    setIsLoading(true)

    try {
      const isPasswordValid = await bcrypt.compare(
        values.password,
        room?.hashedPassword || ''
      )

      if (!isPasswordValid) {
        toast.error('Incorrect password')
        setIsLoading(false)
        return
      }

      const newMember = await addMember.mutateAsync({
        values: {
          name: values.name,
          role: 'user',
          emailAddress: values.emailAddress,
        },
        id: params.id,
      })
      if (addMember.isError) {
        console.error('addMember?.error:', addMember.error)
        toast.error('addMember?.error')
      }
      if (newMember) {
        channel.publish('player_added', {
          roomId: params.id,
          player: {
            name: values.name,
            emailAddress: values.emailAddress,
            role: 'user',
          },
        })

        saveSession({
          name: values.name,
          roomId: params.id,
          emailAddress: values?.emailAddress || user?.user,
          role: Role.user,
        })

        if (newMember) router.push(`/room/${params.id}`)
      } else {
        throw new Error('Failed to add member')
      }
    } catch (error) {
      console.error('Error joining the room:', error)
      toast.error('Failed to join the room')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRoomLoading || sessionLoading || userLoading || isLoading) {
    return <LoadingSkeletonComponent />
  }

  if (roomError) {
    return <ErrorRoomComponent error={roomError} />
  }

  return (
    <div className='container max-w-md py-8 m-auto'>
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title'>Join Game Room</h2>
          <p className='text-base-content/70'>
            Enter your name and the room password to join the game.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormInputField
              label='Your Name'
              icon={<User className='h-4 w-4' />}
              type='text'
              placeholder='Enter your name'
              registration={register('name')}
              error={errors.name?.message}
            />

            <FormInputField
              label='Email Address'
              icon={<MdOutlineAlternateEmail className='h-4 w-4' />}
              type='email'
              placeholder='Enter your email address'
              registration={register('emailAddress')}
              error={errors.emailAddress?.message}
            />

            <FormInputField
              label='Room Password'
              icon={<Lock className='h-4 w-4' />}
              type='password'
              placeholder='Enter room password'
              registration={register('password')}
              error={errors.password?.message}
            />

            <button
              type='submit'
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function FormInputField({
  label,
  icon,
  type,
  placeholder,
  registration,
  error,
}: {
  label: string
  icon: React.ReactNode
  type: string
  placeholder: string
  registration: any
  error?: string
}) {
  return (
    <div className='form-control w-full'>
      <label className='label'>
        <span className='label-text'>{label}</span>
      </label>
      <label className='input input-bordered flex items-center gap-2'>
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          className='grow bg-transparent'
          {...registration}
        />
      </label>
      {error && (
        <label className='label'>
          <span className='label-text-alt text-error'>{error}</span>
        </label>
      )}
    </div>
  )
}

// Loading skeleton component
function LoadingSkeletonComponent() {
  return (
    <div className='container max-w-md py-8 m-auto'>
      <div className='card bg-base-100 shadow-xl animate-pulse'>
        <div className='card-body'>
          <div className='h-8 bg-base-300 rounded w-1/2 mb-4'></div>
          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='h-12 bg-base-300 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Error handling component
function ErrorRoomComponent({ error }: { error: any }) {
  const router = useRouter()
  return (
    <div className='container max-w-md py-8 m-auto'>
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-error'>Error Loading Room</h2>
          <p className='text-base-content/70'>{error.message}</p>
          <button
            className='btn btn-primary mt-4'
            onClick={() => router.push('/my_games')}
          >
            Back to Rooms
          </button>
        </div>
      </div>
    </div>
  )
}
