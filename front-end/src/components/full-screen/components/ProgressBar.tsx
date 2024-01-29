import FSComponentStyle from './fs.module.css';
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import millisecondsToHhMmSs from "../../player/msConverter.ts";
import {useEffect, useRef, useState} from "react";
import seekToPosition from "../../../api/player/seekToPosition.ts";
import {setUserControlActions} from "../../../store/features/navigationSlice.ts";

export function ProgressBar() {
    const currentlyPlayingTrack = useAppSelector(s => s.navigationReducer.currentSongData)
    const [trackProgressState, setTrackProgressState] = useState<number[]>([(Number(currentlyPlayingTrack?.progress_ms) / Number(currentlyPlayingTrack?.item?.duration_ms)) * 100, Number(currentlyPlayingTrack?.progress_ms)])
    const trackProgress = millisecondsToHhMmSs(trackProgressState[1], false)
    const totalDuration = millisecondsToHhMmSs(Number(currentlyPlayingTrack?.item.duration_ms) - trackProgressState[1], false)
    const [hoveringOverTrackbar, setHoveringOverTrackbar] = useState<boolean>(false)
    const trackBarProgressRef = useRef<HTMLDivElement | null>(null)
    const trackInnerProgressRef = useRef<HTMLDivElement | null>(null)
    const [clicked, setClicked] = useState<boolean>(false)
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken)
    const [seekingPos, setSeekingPos] = useState<number | null>(null)
    const dispatch = useAppDispatch();

    useEffect(() => {


        setTrackProgressState((prev) => [(prev[1] / Number(currentlyPlayingTrack?.item?.duration_ms)) * 100, Number(currentlyPlayingTrack?.progress_ms)])

    }, [currentlyPlayingTrack?.progress_ms, currentlyPlayingTrack?.item.uri]);

    useEffect(() => {

        const interval = setInterval(() => {
            if (currentlyPlayingTrack?.is_playing && currentlyPlayingTrack?.progress_ms <= currentlyPlayingTrack?.item.duration_ms) {
                setTrackProgressState((prev) => [(prev[1] / Number(currentlyPlayingTrack?.item?.duration_ms)) * 100, prev[1] + 1000])
            }
        }, 1000)

        return () => clearInterval(interval)

    }, [trackProgressState[1], currentlyPlayingTrack?.item?.duration_ms, currentlyPlayingTrack?.is_playing]);

    useEffect(() => {
            if (seekingPos !== null) {
                const timeout = setTimeout(async () => {
                    await seekToPosition(accessToken, Math.round(seekingPos * Number(currentlyPlayingTrack?.item.duration_ms)))
                    dispatch(setUserControlActions({
                        userAction: 'Seek To Position'
                    }))
                }, 500)


                return () => {
                    clearTimeout(timeout)
                }
            }

        },
        [seekingPos, accessToken]
    )

    useEffect(() => {
        const trackMouse = (e: MouseEvent) => {
            if (clicked) {
                const clientClickedOnX = (e.clientX - Number(trackBarProgressRef.current?.getClientRects()[0].x) - 5) / Number(trackBarProgressRef?.current?.clientWidth)
                setTrackProgressState([clientClickedOnX * 100, clientClickedOnX * Number(currentlyPlayingTrack?.item.duration_ms)])
                setSeekingPos(clientClickedOnX)

            }
            e.preventDefault()
        }


        const instantClickChangePos = (e: MouseEvent) => {
            const clientClickedOnX = (e.clientX - Number(trackBarProgressRef.current?.getClientRects()[0].x) - 5) / Number(trackBarProgressRef?.current?.clientWidth)
            setTrackProgressState([clientClickedOnX * 100, clientClickedOnX * Number(currentlyPlayingTrack?.item.duration_ms)])
            setSeekingPos(clientClickedOnX)

            e.preventDefault()
        }
        trackBarProgressRef.current?.addEventListener('mousedown', setDraggingTrue)
        trackBarProgressRef.current?.addEventListener('mousemove', trackMouse)
        trackBarProgressRef.current?.addEventListener('mouseup', setDraggingFalse)
        trackBarProgressRef.current?.addEventListener('click', instantClickChangePos)

        return () => {
            trackBarProgressRef.current?.removeEventListener('mousedown', setDraggingTrue)
            trackBarProgressRef.current?.removeEventListener('mousemove', trackMouse)
            trackBarProgressRef.current?.removeEventListener('mouseup', setDraggingFalse)
            trackBarProgressRef.current?.removeEventListener('click', instantClickChangePos)
        }

    }, [clicked, accessToken, trackBarProgressRef, trackBarProgressRef.current])


    const setDraggingTrue = () => {
        setClicked(true)
    }
    const setDraggingFalse = () => {
        setClicked(false)
    }

    return currentlyPlayingTrack && <div className={FSComponentStyle['progress-bar']}>
        <div className={FSComponentStyle['time-s-e']}>{trackProgress}</div>

        <div className={FSComponentStyle['outer-progress-tracker']}
             ref={trackBarProgressRef}
             onMouseOver={() => setHoveringOverTrackbar(true)}
             onMouseOut={() => setHoveringOverTrackbar(false)}
        >
            <div className={FSComponentStyle['inner-progress-tracker']}
                 ref={trackInnerProgressRef}

                 style={{
                     width: `${trackProgressState[0]}%`,
                     cursor: 'pointer',
                     backgroundColor: hoveringOverTrackbar ? '#1ed760' : 'white'
                 }}
            >
                <button className={FSComponentStyle['progress-control-btn']}
                        style={hoveringOverTrackbar ? {
                            display: 'block',
                            width: '12px',
                            backgroundColor: 'white',
                            borderRadius: '100%',
                            height: '12px',

                        } : {display: 'none'}}
                >

                </button>
            </div>

        </div>

        <div className={FSComponentStyle['time-s-e']}> -{totalDuration}</div>
    </div>
}

export default ProgressBar