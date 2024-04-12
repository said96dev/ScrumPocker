"use client"
import PlayersListe from './PlayersListe'
import { useSingleRoom } from '@/services/querys'
import { useUpdateVote } from '@/services/mutations';
import GamesCardItem from "./GamesCardItem";
import GamesPageBtns from "./GamesPageBtns";
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const PlayerContainer = ({ params }: { params: { id: string } }) => {
    const queryClient = useQueryClient(); // Zugriff auf den Query Client
    useEffect(() => {
        if (!params.id) return;

        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster: 'eu',
        });

        const channel = pusher.subscribe(`vote-channel-${params.id}`);
        channel.bind('vote-updated', function (data: any) {
            // Hier können Sie beispielsweise Ihre Abstimmungsdaten aktualisieren
            // Vielleicht möchten Sie die React Query-Daten invalidieren oder den lokalen Zustand aktualisieren
            if (data.roomId === params.id) { // Stellen Sie sicher, dass es das richtige Zimmer ist
                queryClient.invalidateQueries({
                    queryKey: ["singleRoom"]
                })
            }
        });
        channel.bind('vote-deleted', function (data: any) {
            setShowCards(false)

            // Hier können Sie beispielsweise Ihre Abstimmungsdaten aktualisieren
            // Vielleicht möchten Sie die React Query-Daten invalidieren oder den lokalen Zustand aktualisieren
            if (data.roomId === params.id) { // Stellen Sie sicher, dass es das richtige Zimmer ist
                setShowCards(false)

                queryClient.invalidateQueries({
                    queryKey: ["singleRoom"]
                })
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    },);

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