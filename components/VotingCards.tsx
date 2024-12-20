import React, { useState, useEffect } from 'react'
import * as Ably from 'ably'
import { useGetCurrentPlayerById } from '@/services/querys'
import { SessionData } from '@/utils/type'

interface VotingCardsProps {
  cards: readonly string[]
  onVote: (value: string) => void
  params: string
  voteResetCounter: number
  playerChannel: any
}

export function VotingCards({
  cards,
  onVote,
  voteResetCounter,
  playerChannel,
  params,
}: VotingCardsProps) {
  const savedSession = localStorage.getItem('gameSession')
  const parsedSession = JSON.parse(savedSession as string) as SessionData
  const { data: player, refetch } = useGetCurrentPlayerById(
    parsedSession.emailAddress,
    params
  )
  const [selectedCard, setSelectedCard] = useState(player?.vote)
  useEffect(() => {
    const handleResetVotes = (message: Ably.Message) => {
      if (message.name === 'reset_votes') {
        setSelectedCard('')
      }
    }

    playerChannel.subscribe('reset_votes', handleResetVotes)

    return () => {
      playerChannel.unsubscribe('reset_votes', handleResetVotes)
    }
  }, [playerChannel])
  /* 
  useEffect(() => {
    setSelectedCard('')
  }, [voteResetCounter]) */

  useEffect(() => {
    if (!selectedCard) setSelectedCard(player?.vote)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])

  const handleCardClick = (card: string) => {
    setSelectedCard(card)
    refetch()
    onVote(card)
  }

  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4'>
      {cards.map((card) => (
        <button
          key={card}
          className={`btn btn-outline btn-lg text-xl font-bold hover:bg-secondary ${
            selectedCard === card
              ? 'bg-secondary text-white border-0'
              : 'btn-secondary'
          }`}
          onClick={() => handleCardClick(card)}
        >
          {card}
        </button>
      ))}
    </div>
  )
}
