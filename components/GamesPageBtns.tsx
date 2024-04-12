import React from 'react'
import { UserRoundMinus } from "lucide-react";
import { useDeleteVote } from '@/services/mutations';


type GamesBtnsProps = {
    roomId: string;
    setShowCards: React.Dispatch<React.SetStateAction<boolean>>;
    showCards: boolean
}

const GamesPageBtns = ({ roomId, setShowCards, showCards }: GamesBtnsProps) => {
    const { mutate } = useDeleteVote()
    const DeleteVoteHandle = (roomId: string) => {
        mutate(roomId)
    }
    return (

        <div className=' grid md:grid-cols-3 justify-center items-center content-center mt-12 '>
            <div className='self-center flex justify-center items-center'>
                <button className="text-base-800 py-2 rounded text-xl">
                    <UserRoundMinus size={30} />
                </button>
            </div>
            <div className='self-center flex justify-center items-center'>
                <button
                    className="bg-secondary text-white py-2 px-4 mr-2 rounded"
                    onClick={() => DeleteVoteHandle(roomId)}
                >
                    Delete Estimates
                </button>
            </div>
            <div className='self-center flex justify-center items-center'>
                <button onClick={() => setShowCards(!showCards)} className={`${showCards ? 'bg-black' : 'bg-success'} text-white py-2 px-4 mr-2 rounded`}
                >
                    {showCards ? "Hide Cards" : "Show Cards"}
                </button>
            </div>
        </div>
    )
}

export default GamesPageBtns