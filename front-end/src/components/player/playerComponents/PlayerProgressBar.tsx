import playerStyle from './../player.module.css'
import {useAppSelector} from "../../../store/hooks.ts";
import millisecondsToHhMmSs from "../msConverter.ts";
import {useEffect, useRef, useState} from "react";
import setPlayerPosition from "../../../api/player/setPlayerPosition.ts";

export function PlayerProgressBar() {
    const [hoverOver, setHoverOver] = useState<boolean>(false);
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken)
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentSongData);
    const [currentlyPlayingProgress, setCurrentlyPlayingProgress] = useState<number>(Number(currentlyPlaying?.progress_ms))
    const durationLeft = "-" + millisecondsToHhMmSs(Number(currentlyPlaying?.item.duration_ms) - currentlyPlayingProgress, false);
    const formattedProgress = millisecondsToHhMmSs(currentlyPlayingProgress);
    const [progressPercentage, setProgressPercentage] = useState<number>(
        Math.round((Number(currentlyPlaying?.progress_ms) / Number(currentlyPlaying?.item.duration_ms)) * 100)
    )
    const [trackProgressState, setTrackProgressState] = useState<number | null>(null)
    const [draggingMouse, setDraggingMouse] = useState<boolean>(false);
    const outerProgressTrackerRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        setProgressPercentage(Math.round((currentlyPlayingProgress / Number(currentlyPlaying?.item.duration_ms)) * 100));
    }, [currentlyPlayingProgress]);

    useEffect(() => {
        if (currentlyPlaying?.is_playing && currentlyPlaying.progress_ms <= currentlyPlaying.item.duration_ms) {
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

    useEffect(() => {
        if (trackProgressState != null) {

            const timeout = setTimeout(async () => {
                setCurrentlyPlayingProgress(Math.round((trackProgressState / 100) * Number(currentlyPlaying?.item.duration_ms)))
                await setPlayerPosition(Math.round(((trackProgressState / 100) * Number(currentlyPlaying?.item.duration_ms))), accessToken)
            }, 500)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [trackProgressState, accessToken])

    useEffect(() => {
        const checkMouseMovement = (e: MouseEvent) => {
            if (draggingMouse) {
                const currentDraggingPercentage = Math.round(((e.clientX - Number(outerProgressTrackerRef.current?.getBoundingClientRect().x)) / Number(outerProgressTrackerRef.current?.clientWidth)) * 100)
                setCurrentlyPlayingProgress(Math.round((currentDraggingPercentage / 100) * Number(currentlyPlaying?.item.duration_ms)))
                setTrackProgressState(currentDraggingPercentage)
                setProgressPercentage(currentDraggingPercentage)

            }
        }

        const changeOnClick = (e: MouseEvent) => {
            const currentDraggingPercentage = Math.round(((e.clientX - Number(outerProgressTrackerRef.current?.getBoundingClientRect().x)) / Number(outerProgressTrackerRef.current?.clientWidth)) * 100)
            setTrackProgressState(currentDraggingPercentage)
            setProgressPercentage(currentDraggingPercentage)
            setCurrentlyPlayingProgress(Math.round((currentDraggingPercentage / 100) * Number(currentlyPlaying?.item.duration_ms)))

        }

        outerProgressTrackerRef.current?.addEventListener('mousedown', setDraggingMouseTrue)
        outerProgressTrackerRef.current?.addEventListener('mousemove', checkMouseMovement)
        outerProgressTrackerRef.current?.addEventListener('click', changeOnClick)
        outerProgressTrackerRef.current?.addEventListener('mouseup', setDraggingMouseFalse)

        return () => {
            outerProgressTrackerRef.current?.removeEventListener('mousedown', setDraggingMouseTrue)
            outerProgressTrackerRef.current?.removeEventListener('mousemove', checkMouseMovement)
            outerProgressTrackerRef.current?.addEventListener('click', changeOnClick)
            outerProgressTrackerRef.current?.removeEventListener('mouseup', setDraggingMouseFalse)
        }
    }, [draggingMouse, outerProgressTrackerRef.current, currentlyPlaying?.item.duration_ms])

    const setDraggingMouseTrue = () => setDraggingMouse(true);
    const setDraggingMouseFalse = () => setDraggingMouse(false)

    return <div className={playerStyle['player-progress-wrapper']}>
        <div className={playerStyle['progress-time']}>
            <p>{formattedProgress}</p>
        </div>

        <div className={playerStyle['progress-outer-tracker']}
             ref={outerProgressTrackerRef}
             onMouseOver={() => setHoverOver(true)}
             onMouseOut={() => setHoverOver(false)}>
            <div className={playerStyle['progress-inner-tracker']}
                 style={{width: `${progressPercentage}%`, backgroundColor: hoverOver ? '#1ed760' : 'white'}}
            >
                <button className={playerStyle['progress-movable-btn']}
                        style={{display: hoverOver ? 'initial' : 'none'}}
                ></button>

            </div>

        </div>

        <div className={playerStyle['progress-time']}>
            <p>{durationLeft}</p>
        </div>
    </div>
}

export default PlayerProgressBar;