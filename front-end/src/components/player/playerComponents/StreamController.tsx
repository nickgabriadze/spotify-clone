import playerStyle from "../player.module.css";
import Play from "../icons/play.svg";
import Pause from "../icons/pause.svg";
import Shuffle from "../icons/shuffle.svg";
import SkipNext from "../icons/skip-next.svg";
import SkipPrevious from "../icons/skip-previous.svg";
import Repeat from "../icons/repeat.svg";
import {CurrentlyPlaying, Disallows} from "../../../types/currentlyPlaying";
import {useEffect, useState} from "react";
import PlayNext from "../../../api/player/playNext";
import PlayPrevious from "../../../api/player/playPrevious";
import {useAppDispatch} from "../../../store/hooks";
import {setUserControlActions} from "../../../store/features/navigationSlice";
import PauseStreaming from "../../../api/player/pauseStreaming";
import PlayResumeStreaming from "../../../api/player/playResumeStreaming";
import ShuffleOn from "../icons/shuffle_on.svg";
import toggleShuffleOnOff from "../../../api/player/toggleShuffleOnOff.ts";
import RepeatOne from "../icons/repeat_one.svg";
import RepeatOn from "../icons/repeat_on.svg"
import setRepeatMode from "../../../api/player/setRepeatMode.ts";
import PlayerProgressBar from "./PlayerProgressBar.tsx";

export function StreamController({
                                     currentlyPlaying,
                                     accessToken,
                                     playbackRepeat,
                                     playbackShuffle,
                                     disallows
                                 }: {
    playbackShuffle: boolean | undefined;
    playbackRepeat: "track" | "context" | "off" | undefined;
    accessToken: string;
    currentlyPlaying: CurrentlyPlaying | undefined;
    disallows: Disallows | undefined
}) {
    const [repeatState, setRepeatState] = useState<string>(String(playbackRepeat))
    const [shuffleState, setShuffleState] = useState<boolean>(Boolean(playbackShuffle))

    const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(currentlyPlaying?.is_playing))
    const repeats: {
        [key: string]: string
    } = {
        'off': Repeat,
        'track': RepeatOne,
        'context': RepeatOn
    }
    const dispatch = useAppDispatch();




    useEffect(() => {

        setShuffleState(Boolean(playbackShuffle))

    }, [playbackShuffle])
    useEffect(() => {

        setRepeatState(String(playbackRepeat))

    }, [playbackRepeat]);

    return (
        <div className={playerStyle["playback-control"]}>
            <div className={playerStyle["actual-controls"]}>
                <button

                    style={{
                        marginBottom: "9px",
                        filter: `${disallows?.toggling_shuffle ? 'brightness(50%)' : 'brightness(100%)'}`
                    }}
                    onClick={async () => {
                        if (!(disallows?.toggling_shuffle === true)) {
                            setShuffleState(prev => !prev)
                            await toggleShuffleOnOff(accessToken, !shuffleState);
                        }
                    }}
                >
                    <img alt="Shuffle" src={shuffleState ? ShuffleOn : Shuffle} width={20}></img>
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
                    <img alt="Skip Previous" className={playerStyle['play-buttons']} src={SkipPrevious}
                         width={30}></img>
                </button>
                <button
                    onClick={async () => {
                        if (currentlyPlaying?.is_playing) {
                            setIsPlaying(false)
                            await PauseStreaming(accessToken);
                            dispatch(setUserControlActions({
                                userAction: 'Pause Streaming'
                            }))
                        } else {
                            setIsPlaying(true)
                            await PlayResumeStreaming(accessToken);
                            dispatch(setUserControlActions({
                                userAction: 'Resume Streaming'
                            }))
                        }
                    }}
                >
                    <img
                        className={playerStyle['play-pause-btn']}
                        alt="Play/Pause"
                        src={isPlaying ? Pause : Play}
                        width={40}
                    ></img>
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
                    <img alt="Skip Next" className={playerStyle['play-buttons']} src={SkipNext} width={30}></img>
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
                        marginBottom: "9px",
                        filter: `${disallows?.toggling_repeat_context || disallows?.toggling_repeat_track ? 'brightness(50%)' : 'brightness(100%)'}`
                    }}>
                    <img alt="Repeat" src={repeats[repeatState]} width={20}></img>
                </button>
            </div>

            <PlayerProgressBar />

        </div>
    )
        ;
}

export default StreamController;
