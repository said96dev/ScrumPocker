import Link from 'next/link'
import { PlaySquare } from 'lucide-react'

export function NoGamesFound() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='bg-base-200 rounded-full p-6 mb-6'>
        <PlaySquare className='w-12 h-12 text-base-content/70' />
      </div>
      <h3 className='text-xl font-semibold mb-2'>No Games Found</h3>
      <p className='text-base-content/70 mb-6 max-w-md'>
        You haven&apos;t created any planning poker games yet. Start your first
        game and invite your team to estimate together!
      </p>
      <Link href='/new_game' className='btn btn-primary'>
        <PlaySquare className='w-4 h-4 mr-2' />
        Create Your First Game
      </Link>
    </div>
  )
}
