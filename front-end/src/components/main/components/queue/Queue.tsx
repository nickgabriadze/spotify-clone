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
    }, [accessToken,currentSongId]);



    return <section className={queueStyle['queue-wrapper']}>
        <h1>Queue</h1>
        <div className={queueStyle['current-track']}>
            <p>Now Playing</p>
            <div
            className={queueStyle['currently-playing-track']}
            >{queueLoading ? <SongCardSkeleton /> : <SongCard eachTrack={queueData?.currently_playing} n={1} accessToken={accessToken} />}</div>
        </div>
    </section>
}

export default Queue;