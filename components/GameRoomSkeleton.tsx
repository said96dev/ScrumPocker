export function GameRoomSkeleton() {
  return (
    <div className='container py-8 gap-8 pt-4'>
      <GameHeander />
      <div className='grid gap-6 md:grid-cols-[2fr_1fr] pt-4'>
        <div className='space-y-6'>
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <div className='h-6 w-32 bg-base-300 rounded animate-pulse mb-4'></div>
              <VotingCardsSkeleton />
            </div>
          </div>
          <GameControlsSkeleton />
        </div>
        <PlayerListSkeleton />
      </div>
    </div>
  )
}

export function GameControlsSkeleton() {
  return (
    <div className='flex gap-4 animate-pulse'>
      <div className='btn  flex-1 bg-base-300'></div>
      <div className='btn bg-base-300'></div>
    </div>
  )
}

export function GameStatsSkeleton() {
  return (
    <div className='card bg-base-100 shadow-xl animate-pulse'>
      <div className='card-body'>
        <div className='h-6 w-40 bg-base-300 rounded mb-4'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Average Stat */}
          <div className='stat bg-base-300 rounded-box p-4'>
            <div className='h-4 w-24 bg-base-200 rounded mb-2'></div>
            <div className='h-8 w-16 bg-base-200 rounded mb-2'></div>
            <div className='h-3 w-20 bg-base-200 rounded'></div>
          </div>
          {/* Participation Stat */}
          <div className='stat bg-base-300 rounded-box p-4'>
            <div className='h-4 w-24 bg-base-200 rounded mb-2'></div>
            <div className='h-8 w-16 bg-base-200 rounded mb-2'></div>
            <div className='h-3 w-20 bg-base-200 rounded'></div>
          </div>
        </div>
        {/* Vote Distribution */}
        <div className='mt-4'>
          <div className='h-5 w-32 bg-base-300 rounded mb-4'></div>
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div className='w-12 h-4 bg-base-300 rounded'></div>
                <div className='flex-1 bg-base-300 rounded-full h-2'></div>
                <div className='w-12 h-4 bg-base-300 rounded'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PlayerListSkeleton() {
  return (
    <div className='card bg-base-100 shadow-xl h-[50vh]'>
      <div className='card-body'>
        <div className='h-6 w-24 bg-base-300 rounded animate-pulse mb-4'></div>
        <div className='space-y-4'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-base-300 rounded-lg animate-pulse'
            >
              <div className='h-4 w-32 bg-base-200 rounded'></div>
              <div className='h-4 w-8 bg-base-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function VotingCardsSkeleton() {
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4'>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className='btn h-24  bg-base-200' />
      ))}
    </div>
  )
}

export function GameHeander() {
  return (
    <div className='flex items-center justify-between  bg-base-100 rounded-lg p-4'>
      <div className='h-6 bg-base-300 rounded w-2/3 mb-4'></div>

      {/* Player Number */}
      <div className='flex justify-between items-center mb-4'>
        <div className='h-4 bg-base-300 rounded w-1/4'></div>
        <div className='flex gap-3'>
          <div className='h-8 w-24 bg-base-300 rounded'></div>
          <div className='h-8 w-24 bg-base-300 rounded'></div>
          <div className='h-8 w-24 bg-base-300 rounded'></div>
        </div>
      </div>
    </div>
  )
}
