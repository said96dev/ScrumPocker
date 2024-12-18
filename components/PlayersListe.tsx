'use client'
import React from 'react'
import Divider from './Divider'
import GamesCardItem from './GamesCardItem'
import { RoomType } from '@/utils/type'
import { redirect } from 'next/navigation'

type PlayersListProps = {
  data: RoomType
  showCards: boolean
}

const PlayersListe = ({ data, showCards }: PlayersListProps) => {
  if (!data || data?.roomMember?.length === 0) {
    redirect('/')
  }
  return (
    <div>
      <div className='flex justify-center items-center h-full '>
        <span className='flex-1 text-center '>Name</span>
        <span className='flex-1'></span>
        <span className='flex-1 text-center'>Story Points</span>
      </div>
      <div>
        <Divider title='Result' />
      </div>
      {data?.roomMember?.map((item, index) => (
        <div key={index}>
          <div key={index} className='flex justify-center items-center h-full '>
            <span className='flex-1 text-center'>{item.name}</span>
            <span className='flex-1'></span>
            <span className='flex-1 text-center'>
              <GamesCardItem title={item.vote || '--'} showCards={showCards} />
            </span>
          </div>
          <div>
            <Divider title='' />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayersListe
