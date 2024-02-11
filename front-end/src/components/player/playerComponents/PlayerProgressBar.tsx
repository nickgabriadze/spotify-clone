import playerStyle from './../player.module.css'
import {useAppSelector} from "../../../store/hooks.ts";
import millisecondsToHhMmSs from "../msConverter.ts";
import {useEffect, useState} from "react";

export function PlayerProgressBar() {
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentSongData);
    const [currentlyPlayingProgress, setCurrentlyPlayingProgress] = useState<number>(Number(currentlyPlaying?.progress_ms))
    const durationLeft = "-" + millisecondsToHhMmSs(Number(currentlyPlaying?.item.duration_ms) - currentlyPlayingProgress, false);
    const formattedProgress = millisecondsToHhMmSs(currentlyPlayingProgress);
    useEffect(() => {
        if (currentlyPlaying?.is_playing && currentlyPlaying.progress_ms  <= currentlyPlaying.item.duration_ms) {
            const timeout = setInterval(() => {
                setCurrentlyPlayingProgress(prev => prev + 1000)
            }, 1000)

            return () => {
                clearInterval(timeout)
            }
        }
    }, [currentlyPlayingProgress, currentlyPlaying?.item.duration_ms, currentlyPlaying?.progress_ms, currentlyPlaying?.is_playing]);

    useEffect(() => {
            setCurrentlyPlayingProgress(Number(currentlyPlaying?.progress_ms));
    }, [currentlyPlaying?.progress_ms, currentlyPlaying?.item.uri]);

    return <div className={playerStyle['player-progress-wrapper']}>
        <div className={playerStyle['progress-time']}>{formattedProgress}</div>

        <div className={playerStyle['progress-outer-tracker']}>

        </div>

        <div className={playerStyle['progress-time']}>{durationLeft}</div>
    </div>
}

export default PlayerProgressBar;