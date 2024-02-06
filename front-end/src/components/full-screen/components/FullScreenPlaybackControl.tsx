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
import {useEffect, useState} from "react";
import PlayNext from "../../../api/player/playNext.ts";
import PlayPrevious from "../../../api/player/playPrevious.ts";
import setRepeatMode from "../../../api/player/setRepeatMode.ts";
import toggleShuffleOnOff from "../../../api/player/toggleShuffleOnOff.ts";

export function FullScreenPlaybackControl() {
    const currentlyPlaying = useAppSelector(s => s.navigationReducer.currentSongData)
    const [playingOrPaused, setPlayingOrPaused] = useState<boolean>(Boolean(currentlyPlaying?.is_playing))
    const accessToken = useAppSelector(s => s.spotiUserReducer.spotiToken.accessToken);
    const disallows = currentlyPlaying?.actions?.disallows;
    const globalPlaybackStateInformation = useAppSelector(s => s.navigationReducer.globalPlaybackStateInformation)
    const [repeatState, setRepeatState] = useState<"off" | "context" | "track" | undefined>(globalPlaybackStateInformation?.repeat_state)
    const [shuffleState, setShuffleState] = useState<boolean>(Boolean(globalPlaybackStateInformation?.shuffle_state))
    const dispatch = useAppDispatch();
    const repeats: {
        [key: string]: string
    } = {
        'off': Repeat,
        'track': RepeatOne,
        'context': RepeatOn
    }
    useEffect(() => {
        setPlayingOrPaused(Boolean(currentlyPlaying?.is_playing))
    }, [currentlyPlaying?.is_playing]);

    return <div className={FSStyling["playback-controls-wrapper"]}>
        <button
            style={{
                filter: `${disallows?.toggling_shuffle ? 'brightness(70%)' : 'brightness(100%)'}`
            }}
            onClick={async () => {
                if (!(disallows?.toggling_shuffle === true)) {
                    setShuffleState(prev => !prev)

                    await toggleShuffleOnOff(accessToken, !shuffleState);
                }
            }}
        >
            <img alt={"Shuffle icon"}
                 className={FSStyling['shuffle-icon']}

                 src={shuffleState ? ShuffleOn : ShuffleOff}/>
        </button>


        <button
            onClick={async () => {
                await PlayPrevious(accessToken);
                dispatch(
                    setUserControlActions({
                        userAction: "Play Previous Song",
                    })
                );
            }}
        >

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

        <button
            onClick={() => {
                const playNextSong = async () => {
                    await PlayNext(accessToken)
                    dispatch(
                        setUserControlActions({
                            userAction: "Play Next Song",
                        })
                    );
                }

                playNextSong()


            }}
        >

            <img alt={"Skip Next icon"} src={SkipNext}
                 className={FSStyling['skip-prev-next-icon']}
            />
        </button>

        <button
            onClick={async () => {
                if (disallows?.toggling_repeat_context === true && !disallows.toggling_repeat_track) {
                    setRepeatState(repeatState === 'track' ? 'off' : 'track')
                    await setRepeatMode(accessToken, repeatState === 'track' ? 'off' : 'track');
                } else if (disallows?.toggling_repeat_track === true && !disallows.toggling_repeat_context) {
                    setRepeatState(repeatState === 'context' ? 'off' : 'context')
                    await setRepeatMode(accessToken, repeatState === 'context' ? 'off' : 'context');
                } else if (!disallows?.toggling_repeat_track && !disallows?.toggling_repeat_context) {
                    if (repeatState === 'off') {
                        setRepeatState('context')
                        await setRepeatMode(accessToken, 'context');
                    } else if (repeatState === 'context') {
                        setRepeatState('track')
                        await setRepeatMode(accessToken, 'track');
                    } else if (repeatState === 'track') {
                        setRepeatState('off')
                        await setRepeatMode(accessToken, 'off');
                    }
                }
            }
            }

            style={{
                filter: `${disallows?.toggling_repeat_context || disallows?.toggling_repeat_track ? 'brightness(70%)' : 'brightness(100%)'}`
            }}>


            <img alt={"Repeat State Icon"}
                 className={FSStyling['repeat-icon']}

                 src={repeats[repeatState === undefined ? 'off' : repeatState]}/>
        </button>
    </div>
}

export default FullScreenPlaybackControl;