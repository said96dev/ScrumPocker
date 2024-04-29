"use client"
import PlayersListe from './PlayersListe'
import { useSingleRoom } from '@/services/querys'
import { useUpdateVote } from '@/services/mutations';
import GamesCardItem from "./GamesCardItem";
import GamesPageBtns from "./GamesPageBtns";
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabaseClient';
const PlayerContainer = ({ params }: { params: { id: string } }) => {

    const setNewRoom = async () => {
        const { data, error } = await supabase
            .from('Room')
            .insert([{
                id: params.id
            }])
        if (error) {
            console.log(error)
        } else {
            console.log(data)
        }
    }

    setNewRoom()

    const queryClient = useQueryClient(); // Zugriff auf den Query Client


    const [showCards, setShowCards] = useState(false)
    const { data } = useSingleRoom(params.id)

    const cleanString = data?.type.substring(data?.type.indexOf('(') + 1, data?.type.length - 1)
    const sizesArray = cleanString?.split(',').map(size => size.toLowerCase());
    const updateVote = useUpdateVote()



    const UpdateVoteHandle = (value: string) => {
        updateVote.mutate({
            roomId: params.id,
            value: value
        })
    }
    if (!data) {
        return <p>No data to Show</p>
    }
    return (
        <div className='bg-base-100 p-4 shadow-md rounded-md'>
            <div>
                <div className="flex mt-4 justify-center">
                    {
                        sizesArray?.map((item, index) => {
                            return (
                                <GamesCardItem key={index}
                                    title={item} OnEdit={UpdateVoteHandle} type="vote" />
                            )
                        })
                    }
                </div>
                <div className="my-4">
                    <GamesPageBtns roomId={params.id} setShowCards={setShowCards} showCards={showCards} />
                </div>

            </div>
            <PlayersListe data={data} showCards={showCards} />
        </div>
    )
}

export default PlayerContainer