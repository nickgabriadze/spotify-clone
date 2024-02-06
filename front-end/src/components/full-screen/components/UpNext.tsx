import FSComponentStyle from './fs.module.css';
import {useAppSelector} from "../../../store/hooks.ts";
import {useEffect, useState} from "react";
import getSongQueue from "../../../api/player/getSongQueue.ts";
import {Track} from "../../../types/track.ts";


export function UpNextInQueue() {
    const [data, setNextTrack] = useState<Track | undefined>(undefined)
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const currentlyPlayingSong = useAppSelector(s => s.navigationReducer.currentSongData)
    const [showUpNext, setShowUpNext] = useState<boolean>(true);
    useEffect(() => {

        const getQueueSongs = async () => {
            try {
                const req = await getSongQueue(accessToken);
                const queue = req.data
                if (currentlyPlayingSong?.item.uri !== queue.queue[0].uri) {
                    setNextTrack(queue.queue[0])
                }
                setShowUpNext(true)
            } catch (err) {
                console.log(err)
            }
        }

        getQueueSongs()

        const timeOut = setTimeout(() => {
            setShowUpNext(false)

        }, 5000)



        return () => {
            clearTimeout(timeOut)
        }

    }, [accessToken, currentlyPlayingSong?.item?.uri]);


    return data && <div className={FSComponentStyle['up-next-queue']}
                        style={!showUpNext ? {opacity: 0}:{opacity:'100%'}}
    >
        {data?.album.images[0].url && <img alt={"Next song Image"}
                                           src={data?.album.images[0].url}
                                           width={60} height={60} draggable={false}/>}

        <div className={FSComponentStyle['next-song-details']}>
            <h1>UP NEXT</h1>
            <div><p className={FSComponentStyle['next-song-title']}
                    style={data?.name.length > 40 ? {'width': '300px'} : {'width': 'fit-content'}}
            >{data?.name}</p>  <p> • {data?.artists[0].name}</p></div>
        </div>
    </div>
}

export default UpNextInQueue;