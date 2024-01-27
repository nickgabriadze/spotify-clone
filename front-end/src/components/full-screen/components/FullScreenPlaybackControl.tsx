import FSStyling from './fs.module.css'
import ShuffleOff from "./../../player/icons/shuffle.svg"
import ShuffleOn from './../../player/icons/shuffle_on.svg'
import SkipPrevious from './../icons/skip-previous.svg'
import SkipNext from './../icons/skip-next.svg'
import PlayResume from './../../player/icons/play.svg'
import Pause from './../../player/icons/pause.svg'
import Repeat from './../../player/icons/repeat.svg'
import RepeatOn from './../../player/icons/repeat_on.svg'
import RepeatOne from './../../player/icons/repeat_one.svg'
import PauseStreaming from "../../../api/player/pauseStreaming.ts";
import {setUserControlActions} from "../../../store/features/navigationSlice.ts";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming.ts";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {useState} from "react";

export function FullScreenPlaybackControl() {
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentSongData)
    const [playingOrPaused, setPlayingOrPaused] = useState<boolean>(Boolean(currentlyPlaying?.is_playing))
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const dispatch = useAppDispatch();
    return <div className={FSStyling["playback-controls-wrapper"]}>
        <button>
            <img alt={"Shuffle icon"}
                 className={FSStyling['shuffle-icon']}

                 src={ShuffleOff}/>
        </button>


        <button>

            <img alt={"Skip Previous icon"}

                 className={FSStyling['skip-prev-next-icon']}
                 src={SkipPrevious}/>
        </button>

        <button
            onClick={async () => {
                if (currentlyPlaying?.is_playing) {
                    setPlayingOrPaused(false)
                    await PauseStreaming(accessToken);
                    dispatch(setUserControlActions({
                        userAction: 'Pause Streaming'
                    }))
                } else {
                    setPlayingOrPaused(true)
                    await PlayResumeStreaming(accessToken);
                    dispatch(setUserControlActions({
                        userAction: 'Resume Streaming'
                    }))
                }
            }}
        >

            <img alt={"Resume/Play/Pause icon"} src={playingOrPaused ? Pause : PlayResume}
                 className={FSStyling['play-resume-icon']}
            />
        </button>

        <button>

            <img alt={"Skip Next icon"} src={SkipNext}
                 className={FSStyling['skip-prev-next-icon']}
            />
        </button>

        <button>

            <img alt={"Repeat State Icon"}
                 className={FSStyling['repeat-icon']}

                 src={Repeat}/>
        </button>
    </div>
}

export default FullScreenPlaybackControl;