import React from 'react'
import { ShieldQuestion } from 'lucide-react'
import { LockKeyhole } from 'lucide-react'
type GamesCradProps = {
    title: string,
    type?: string
    OnEdit?: (value: string) => void
    showCards?: boolean
}

const GamesCardItem = ({ title, OnEdit, type, showCards }: GamesCradProps) => {
    return (
        <div className=''>
            {type ? <button onClick={() => OnEdit?.(title)} className="bg-gray-300 text-gray-800 py-6 px-8 mr-2 rounded text-xl">
                {title}
            </button> : <button onClick={() => OnEdit?.(title)} className="bg-gray-300 text-gray-800 py-6 px-8 mr-2 rounded text-xl">
                {title === "--" && !showCards ? <ShieldQuestion className='text-base-500' /> : (!showCards ? <LockKeyhole className='text-secondary' /> : title)}
            </button>}
        </div>
    )
}

export default GamesCardItem