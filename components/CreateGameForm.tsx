'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  createAndEditRoomSchema,
  createAndEditRoomType,
  controller,
} from '@/utils/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateRoom } from '@/services/mutations'
import { BiLoader } from 'react-icons/bi'
import { v4 as uuidv4 } from 'uuid'
import { useGetVotingSystems } from '@/services/querys'
import { editRoomSchema, EditRoomType } from '@/utils/editRoomSchema'
import { useRouter } from 'next/navigation'

type CreateProps = {
  mode: 'create' | 'edit' // oder andere mögliche Werte
  value?: any
  setOpenEdit?: (state: boolean) => void
  EditRoomSettings?: (updatedSettings: EditRoomType, id: string) => void
}
const CreateGameForm = ({
  mode,
  value,
  setOpenEdit,
  EditRoomSettings,
}: CreateProps) => {
  const { data } = useGetVotingSystems()
  const { mutate, isPending } = useCreateRoom()
  const [gameLink, setGameLink] = useState<string>('')
  const router = useRouter()
  const [shareUrl, setShareUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    typeof mode extends 'edit' ? EditRoomType : createAndEditRoomType
  >({
    resolver: zodResolver(
      mode === 'edit' ? editRoomSchema : createAndEditRoomSchema
    ),
    defaultValues: {
      name: value?.name || '',
      votingId: value?.votingSystems[0].votingId || 1,
      controller: value?.controller || controller.AllPlayers,
      autoRevealCards: value?.autoRevealCards || false,
      showAveraging: value?.showAveraging || false,
      hashedPassword: mode === 'edit' ? undefined : '',
      roomId: mode === 'edit' ? value?.id : undefined,
      reset: value?.reset || controller.AllPlayers,
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.origin)
    }
  }, [])
  async function onSubmit(
    values: typeof mode extends 'edit' ? EditRoomType : createAndEditRoomType
  ) {
    if (mode === 'create') {
      const newUuid = uuidv4()
      const updatedValues = {
        ...values,
        votingId: Number(values.votingId),
        id: newUuid,
      }
      setGameLink(`${shareUrl}/room/${newUuid}`)
      mutate(updatedValues)
      await new Promise((resolve) => setTimeout(resolve, 4000))
      router.push('/my_games')
    } else {
      //@ts-ignore
      EditRoomSettings(values as EditRoomType, value?.id)
      setOpenEdit ? setOpenEdit(false) : ''
    }
  }

  return (
    <div
      className={`w-full flex flex-col lg:flex-row justify-between items-stretch gap-4 h-full ${
        mode !== 'edit' ? 'pt-14 pb-4' : ''
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`rounded  flex justify-center items-center flex-col gap-4 
        ${gameLink ? 'lg:w-1/2' : 'w-full mx-auto'}`}
      >
        <label className='form-control w-full max-w-xl'>
          <div className='label'>
            <span className='label-text text-xl'>Game&apos;s name?</span>
          </div>
          <input
            {...register('name')}
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full max-w-xl'
          />
          {errors.name && (
            <div className='text-red-500'>{errors.name?.message}</div>
          )}
        </label>
        <label className='form-control w-full max-w-xl'>
          <div className='label'>
            <span className='label-text text-xl'>Who can reveal cards?</span>
          </div>
          <select
            {...register('controller')}
            defaultValue='All Players'
            className='select select-bordered w-full max-w-xl'
          >
            <option>All Players</option>
            <option>Just me</option>
          </select>
        </label>
        <label className='form-control w-full max-w-xl'>
          <div className='label'>
            <span className='label-text text-xl'>Who can reset the votes?</span>
          </div>
          <select
            {...register('reset')}
            defaultValue='All Players'
            className='select select-bordered w-full max-w-xl'
          >
            <option>All Players</option>
            <option>Just me</option>
          </select>
        </label>
        <label className='form-control w-full max-w-xl'>
          <div className='label'>
            <span className='label-text text-xl'>Voting system</span>
          </div>
          <select
            {...register('votingId')}
            defaultValue='Pick one'
            className='select select-bordered w-full max-w-xl'
          >
            <option disabled>Pick one</option>
            {data?.map((item) => {
              const result = [...new Set(item.values)].join(', ')
              return (
                <option key={item.id} value={item.id}>
                  {item.name} : ({result})
                </option>
              )
            })}
          </select>
          {errors.votingId && (
            <p className='text-red-500'>{errors.votingId.message}</p>
          )}
        </label>
        {mode === 'create' ? (
          <div className={`form-control w-full max-w-xl`}>
            <label className='label-text text-xl' htmlFor='hashedPassword'>
              Passwort (Required)
            </label>
            <input
              {...register('hashedPassword', {
                required: 'Password is required for creating a game',
              })}
              name='hashedPassword'
              type='password'
              className='input input-bordered w-full max-w-xl'
            />
            {errors.hashedPassword && (
              <p className='text-red-500'>{errors.hashedPassword?.message}</p>
            )}
          </div>
        ) : null}
        <div className='form-control w-full max-w-xl'>
          <label className='cursor-pointer label '>
            <div className='flex flex-col'>
              <span className='label-text text-xl'>Auto-reveal cards</span>
              <i className='text-base-content'>
                Show cards automatically after everyone voted.
              </i>
            </div>
            <input
              {...register('autoRevealCards')}
              type='checkbox'
              className='toggle toggle-secondary'
            />
          </label>
        </div>
        <div className='form-control w-full max-w-xl'>
          <label className='cursor-pointer label '>
            <div className='flex flex-col'>
              <span className='label-text text-xl'>
                Show average in the results
              </span>
              <i className='text-base-content'>
                Include the average value in the results of the voting.
              </i>
              <i className=' text-xs text-error font-semibold'>
                Note: Averages cannot be calculated for t-shirt sizes.
              </i>
            </div>
            <input
              {...register('showAveraging')}
              type='checkbox'
              className='toggle toggle-secondary'
            />
          </label>
        </div>

        <button
          type='submit'
          className='btn btn-secondary'
          disabled={isPending}
        >
          {isPending ? (
            <>
              <BiLoader className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </>
          ) : mode === 'create' ? (
            'Create Game'
          ) : (
            'Update Game'
          )}
        </button>
      </form>
      {gameLink && (
        <div className='w-3/4 lg:w-1/2 flex flex-col'>
          <div className='label'>
            <span className='label-text text-xl'>
              Your game has been created! Share this link with your team:{' '}
            </span>
          </div>
          <input
            value={gameLink}
            readOnly
            className='input input-bordered w-full'
          />
          {errors.name && (
            <div className='text-red-500'>{errors.name?.message}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateGameForm
