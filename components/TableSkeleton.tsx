export function RoomListSkeleton() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 '>
      {Array.from({ length: 8 }).map((_, index) => (
        <RoomCardSkeleton key={index} />
      ))}
    </div>
  )
}

function RoomCardSkeleton() {
  return (
    <div className='card bg-base-100 animate-pulse'>
      <div className='card-body'>
        <div className='flex justify-between items-start'>
          <div className='h-6 w-32 bg-base-300 rounded'></div>
          <div className='h-8 w-8 bg-base-300 rounded'></div>
        </div>
        <div className='space-y-2 mt-4'>
          <div className='h-4 w-48 bg-base-300 rounded'></div>
          <div className='h-4 w-24 bg-base-300 rounded'></div>
        </div>
        <div className='card-actions justify-end mt-4'>
          <div className='h-8 w-20 bg-base-300 rounded'></div>
        </div>
      </div>
    </div>
  )
}
