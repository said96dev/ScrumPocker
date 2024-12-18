'use client'
import { useSingleRoom } from '@/services/querys'
import { useResetVotes, useUpdateVote } from '@/services/mutations'
import { VotingCards } from './VotingCards'
import { GameControls } from './GameControls'
import { PlayerList } from './PlayerList'
import { useSession } from '@/Hooks/useSession'
import { SessionData } from '@/utils/type'
import { useChannel } from '@/utils/ably'
import { useState, useEffect, useCallback, useRef } from 'react'
import * as Ably from 'ably'
import { IoSettingsSharp } from 'react-icons/io5'
import EditDialog from './EditDialog'
import DeleteDialog from './DeleteDialog'
import { FaRegTrashAlt, FaShare } from 'react-icons/fa'
import ShareDialog from './ShareDialog'
import GameStats from './GameStats'
import { VotingSystem } from '@/lib/types'
import { Error } from './error'
import { GameRoomSkeleton } from './GameRoomSkeleton'
import { useRouter } from 'next/navigation'
const PlayerContainer = ({ params }: { params: { id: string } }) => {
  const { data, refetch, isError, isLoading } = useSingleRoom(params.id)
  const { session } = useSession()
  const updateVote = useUpdateVote()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openShare, setOpenShare] = useState(false)
  const { mutateAsync } = useResetVotes()
  const route = useRouter()
  const [players, setPlayers] = useState(data?.roomMembers || [])
  const [revelCards, setRevelCards] = useState<boolean>(false)
  const voteResetCounterRef = useRef(0)

  const gameControlChannel = useChannel(
    `room:${params.id}:gameControl`,
    useCallback((message: Ably.Message) => {
      if (message.name === 'reveal_cards_update') {
        setRevelCards(message.data.revelCards)
      }
    }, [])
  )

  const setRevelCardsAndPublish = useCallback(
    (state: boolean) => {
      setRevelCards(state)
      gameControlChannel.publish('reveal_cards_update', { revelCards: state })
    },
    [gameControlChannel]
  )

  const voteChannel = useChannel(
    `room:${params.id}:votes`,
    useCallback(
      (message: Ably.Message) => {
        if (message.name === 'vote_update') {
          refetch()
        }
      },
      [refetch]
    )
  )
  const SettingsChannel = useChannel(
    `room:${params.id}:settings`,
    useCallback(
      (message: Ably.Message) => {
        if (message.name === 'settings_update') {
          refetch()
        }
      },
      [refetch]
    )
  )
  useEffect(() => {
    if (data) {
      setPlayers(data.roomMembers)
      const allVote = data.roomMembers.filter((member) => member.vote === '--')
      if (allVote.length === 0 && data.autoRevealCards) {
        setRevelCardsAndPublish(true)
      }
    }
  }, [data])

  const playerChannel = useChannel(
    `room:${params.id}:resetting`,
    useCallback(
      (message: Ably.Message) => {
        if (message.name === 'reset_votes') {
          voteResetCounterRef.current = message.data.resetCounter
          refetch()
          setRevelCards(false)
        }
      },
      [refetch]
    )
  )
  const handleResetVotes = async () => {
    await mutateAsync(params.id)
    voteResetCounterRef.current += 1
    setRevelCards(false)
    await playerChannel.publish('reset_votes', {
      action: 'reset_votes',
      resetCounter: voteResetCounterRef.current,
    })
    refetch()
  }

  const UpdateVoteHandle = async (value: string) => {
    await updateVote.mutateAsync({
      session: session as SessionData,
      value: value,
    })
    voteChannel.publish('vote_update', { roomId: params.id, value })
  }
  const EditRoomSettingsHandler = async () => {
    SettingsChannel.publish('settings_update', { roomId: params.id })
  }

  if (isLoading) {
    return <GameRoomSkeleton />
  }
  if (isError || (!data && !isLoading) || !data || !data.roomMembers) {
    return (
      <div className='container max-w-2xl py-8 mx-auto'>
        <Error
          title='Failed to load game'
          message={'Failed to load game'}
          action={{
            label: 'Try Again',
            onClick: () => route.push('/my_games'),
          }}
        />
      </div>
    )
  }
  return (
    <div className='gap-8 pt-4'>
      <div className='bg-base-100 rounded-lg flex flex-col p-4'>
        <h2 className='text-2xl justify-center items-center font-bold'>
          Game Name: {data.name}
        </h2>
        <div className='flex md:flex-row justify-between flex-col'>
          <h2 className='text-md justify-center items-center'>
            Players Number: {players?.length}
          </h2>
          <div className='flex flex-wrap justify-end pt-2 sm:pt-0 gap-3 '>
            {session?.role === 'ADMIN' && (
              <>
                <button
                  className='btn btn-accent btn-sm flex items-center gap-2'
                  onClick={() => setOpenEdit(!openEdit)}
                >
                  <IoSettingsSharp className='text-lg' />

                  <span className='sr-only md:not-sr-only'>Settings</span>
                </button>
                <button
                  className='btn btn-error btn-sm flex items-center gap-2'
                  onClick={() => setOpenDelete(!openDelete)}
                >
                  <FaRegTrashAlt className='text-lg' />{' '}
                  <span className='sr-only md:not-sr-only'>Delete</span>
                </button>
              </>
            )}
            <button
              className='btn btn-neutral btn-sm flex items-center gap-2'
              onClick={() => setOpenShare(!openShare)}
            >
              <FaShare className='text-lg' />
              <span className='sr-only md:not-sr-only'>Share</span>
            </button>
          </div>
        </div>
      </div>
      <div className='grid gap-x-6 md:grid-cols-[2fr_1fr] container py-4'>
        <div className='space-y-4'>
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title'>Voting Cards</h2>
              <VotingCards
                cards={data.votingSystems[0].voting.values}
                onVote={UpdateVoteHandle}
                params={params.id}
                voteResetCounter={voteResetCounterRef.current}
                playerChannel={playerChannel}
              />
            </div>
          </div>
          <div className='flex gap-4 flex-col'>
            {' '}
            <GameControls
              revelCards={revelCards}
              setRevelCards={setRevelCardsAndPublish}
              params={params.id}
              refetch={refetch}
              autoRevealCards={data.autoRevealCards}
              reset={data.reset}
              controller={data.controller}
              handleResetVotes={handleResetVotes}
            />
            <GameStats
              players={data.roomMembers}
              revealed={true}
              showAverage={data.showAveraging}
              votingSystem={data.votingSystems[0].voting.name as VotingSystem}
              revelCards={revelCards}
            />
          </div>
        </div>
        <div className='pt-4 sm:pt-0'>
          <PlayerList
            players={data.roomMembers}
            revelCards={revelCards}
            params={params.id}
            refetch={refetch}
          />
        </div>
      </div>
      <>
        {openEdit && (
          <EditDialog
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            id={params.id}
            room={data}
            EditRoomSettingsHandler={EditRoomSettingsHandler}
          />
        )}
        {openDelete && (
          <DeleteDialog
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            id={params.id}
          />
        )}
        {openShare && (
          <ShareDialog
            openShare={openShare}
            setOpenShare={setOpenShare}
            id={params.id}
          />
        )}
      </>
    </div>
  )
}

export default PlayerContainer
