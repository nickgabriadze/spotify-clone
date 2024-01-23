import FSComponentStyle from './fs.module.css';
import {useAppSelector} from "../../../store/hooks.ts";
import millisecondsToHhMmSs from "../../player/msConverter.ts";
import {useEffect, useRef, useState} from "react";

export function ProgressBar() {
    const currentlyPlayingTrack = useAppSelector(s => s.navigationReducer.currentSongData)
    const [trackProgressState, setTrackProgressState] = useState<number[]>([(Number(currentlyPlayingTrack?.progress_ms) / Number(currentlyPlayingTrack?.item?.duration_ms)) * 100, Number(currentlyPlayingTrack?.progress_ms)])
    const trackProgress = millisecondsToHhMmSs(trackProgressState[1], false)
    const totalDuration = millisecondsToHhMmSs(Number(currentlyPlayingTrack?.item.duration_ms) - trackProgressState[1], false)
    const [hoveringOverTrackbar, setHoveringOverTrackbar] = useState<boolean>(false)
    const trackBarProgressRef = useRef<HTMLDivElement | null>(null)
    const trackInnerProgressRef = useRef<HTMLDivElement | null>(null)
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
        const trackMouse = (e: MouseEvent) => {
            if (e.target === trackBarProgressRef?.current
                || e.target === trackInnerProgressRef?.current
            ) {
                const clientClickedOnX = (e.clientX - Number(trackBarProgressRef.current?.getClientRects()[0].x) - 5) / Number(trackBarProgressRef?.current?.clientWidth)
                console.log(clientClickedOnX)

                setTrackProgressState([clientClickedOnX * 100, clientClickedOnX * Number(currentlyPlayingTrack?.item.duration_ms)])


            }

        }

        window.addEventListener('click', (e) => trackMouse(e))


        return () => window.removeEventListener('click', (e) => trackMouse(e))
    }, [trackBarProgressRef?.current, trackInnerProgressRef?.current])


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