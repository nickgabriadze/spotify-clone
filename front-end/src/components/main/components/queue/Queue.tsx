import {useEffect, useState} from "react";
import getSongQueue from "../../../../api/player/getSongQueue.ts";
import {useAppSelector} from "../../../../store/hooks.ts";
import {QueueType} from "../../../../types/queue.ts";
import queueStyle from "./queue.module.css";
import SongCardSkeleton from "../../../../skeletons/songCardSkeleton.tsx";
import {SongCard} from "../../../search/reuseables/songCard.tsx";

export function Queue() {
    const accessToken = useAppSelector(state => state.spotiUserReducer.spotiToken.accessToken)
    const [queueData, setQueueData] = useState<QueueType>();
    const [queueLoading, setQueueLoading] = useState<boolean>(true);
    const currentSongId = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong.songID);

    useEffect(() => {
        const fetchQueue = async () => {

            try {
                setQueueLoading(true)
                const requestQueue = await getSongQueue(accessToken)
                const queueData = requestQueue.data;
                setQueueData(queueData)

            } catch (err) {

            } finally {
                setQueueLoading(false)
            }
        }
        fetchQueue()
    }, [accessToken, currentSongId]);


    const noNewSongsInQueue = queueData?.queue.filter((song) => song.id !== queueData?.currently_playing?.id).length === 0;
    const everyNewTrackIsFromTheSameArtist = queueData?.queue.every((track) => track.artists.filter(eachArtist => eachArtist?.id === queueData?.currently_playing?.artists[0]?.id)[0]?.id === queueData?.currently_playing?.artists[0]?.id)
    return <section className={queueStyle['queue-wrapper']}>

        <div className={queueStyle['queue']}>

            <h1>Queue</h1>
            <div className={queueStyle['current-track']}>
                <p>Now Playing</p>
                <div
                    className={queueStyle['currently-playing-track']}
                >{queueLoading ? <SongCardSkeleton/> :
                    <SongCard eachTrack={queueData?.currently_playing} n={1} accessToken={accessToken}/>}</div>
            </div>

            {!noNewSongsInQueue && <div className={queueStyle['next-up-in-queue']}>
                <div
                style={{color: '#b3b3b3'}}>{everyNewTrackIsFromTheSameArtist ?
                    <div>Next from: <a>{queueData?.currently_playing.artists[0].name}</a></div> : `Next up`}</div>
                <div className={queueStyle['upcoming-tracks']}>
                    {queueLoading ? Array.from({length: 30}).map((_, i) => <SongCardSkeleton
                        key={i}/>) : queueData?.queue.map((eachTrack, i) => <SongCard key={i} eachTrack={eachTrack}
                                                                                      n={i + 2}
                                                                                      accessToken={accessToken}/>)}

                </div>
            </div>}
        </div>
    </section>
}

export default Queue;