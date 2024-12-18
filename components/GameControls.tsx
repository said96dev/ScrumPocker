import { Eye, RotateCcw } from 'lucide-react'

import { useSession } from '@/Hooks/useSession'

interface GameControlsProps {
  revelCards: boolean
  setRevelCards: (state: boolean) => void
  params: string
  refetch: () => void
  reset: string
  autoRevealCards: boolean
  controller: string
  handleResetVotes: () => void
}

export function GameControls({
  revelCards,
  setRevelCards,
  reset,
  controller,
  handleResetVotes,
}: GameControlsProps) {
  const { session } = useSession()
  return (
    <div className='flex gap-x-4 flex-col sm:flex-row gap-4 pb-4 sm:bp-0'>
      {(controller === 'All Players' || session?.role === 'ADMIN') && (
        <button
          className='btn btn-secondary flex-1'
          onClick={() => setRevelCards(!revelCards)}
        >
          <Eye className='mr-2 h-4 w-4' />
          Reveal Cards
        </button>
      )}
      {(reset === 'All Players' || session?.role === 'ADMIN') && (
        <button
          className='btn btn-outline btn-secondary'
          onClick={() => handleResetVotes()}
        >
          <RotateCcw className='mr-2 h-4 w-4' />
          Reset Votes
        </button>
      )}
    </div>
  )
}
/*  export function GameControls({
   onReveal,
   onReset,
   revealed,
 }: GameControlsProps) {
   return (
     <div className='flex gap-4'>
       <button
         className='btn btn-primary flex-1'
         onClick={onReveal}
         disabled={revealed}
       >
         <Eye className='mr-2 h-4 w-4' />
         Reveal Cards
       </button>
       <button className='btn btn-outline' onClick={onReset}>
         <RotateCcw className='mr-2 h-4 w-4' />
         Reset Votes
       </button>
     </div>
   )
 } */
