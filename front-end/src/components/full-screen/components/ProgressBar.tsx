import FSComponentStyle from './fs.module.css';
import {useAppSelector} from "../../../store/hooks.ts";
import millisecondsToHhMmSs from "../../player/msConverter.ts";
import {useEffect, useState} from "react";

export function ProgressBar() {
    const currentlyPlayingTrack = useAppSelector(s => s.navigationReducer.currentSongData)
    const [trackProgressState, setTrackProgressState] = useState<number>(Number(currentlyPlayingTrack?.progress_ms))
    const trackProgress = millisecondsToHhMmSs(trackProgressState, false)
    const totalDuration = millisecondsToHhMmSs(Number(currentlyPlayingTrack?.item.duration_ms) - trackProgressState, false)
    const [hoveringOverTrackbar, setHoveringOverTrackbar] = useState<boolean>(false)
    useEffect(() => {

        setTrackProgressState(Number(currentlyPlayingTrack?.progress_ms))

    }, [currentlyPlayingTrack?.progress_ms, currentlyPlayingTrack?.item.uri]);

    useEffect(() => {

        const interval = setInterval(() => {
            if (currentlyPlayingTrack?.is_playing && currentlyPlayingTrack?.progress_ms <= currentlyPlayingTrack?.item.duration_ms) {
                setTrackProgressState((prev) => prev + 1000)
            }
        }, 1000)

        return () => clearInterval(interval)

    }, [trackProgressState, currentlyPlayingTrack?.item?.duration_ms, currentlyPlayingTrack?.is_playing]);


    return currentlyPlayingTrack && <div className={FSComponentStyle['progress-bar']}>
        <div className={FSComponentStyle['time-s-e']}>{trackProgress}</div>

        <div className={FSComponentStyle['outer-progress-tracker']}
             onMouseOver={() => setHoveringOverTrackbar(true)}
             onMouseOut={() => setHoveringOverTrackbar(false)}
        >
            <div className={FSComponentStyle['inner-progress-tracker']}

                 style={{
                     width: `${(trackProgressState / Number(currentlyPlayingTrack?.item.duration_ms)) * 100}%`,
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