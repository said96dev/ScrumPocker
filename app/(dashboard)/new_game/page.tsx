'use client'
import React from 'react'
import CreateGameForm from '@/components/CreateGameForm'
const NewGamePage = () => {
  return (
    <div className='flex justify-center items-center h-full'>
      <CreateGameForm mode='create' />
    </div>
  )
}

export default NewGamePage
