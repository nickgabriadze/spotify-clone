import playerStyle from "../player.module.css";
import millisecondsToMmSs from "../msConverter";
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
import SeekToPosition from "../../../api/player/seekToPosition";
import ShuffleOn from "../icons/shuffle_on.svg";
import toggleShuffleOnOff from "../../../api/player/toggleShuffleOnOff.ts";
import RepeatOne from "../icons/repeat_one.svg";
import RepeatOn from "../icons/repeat_on.svg"
import setRepeatMode from "../../../api/player/setRepeatMode.ts";

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
    const [pos, setPos] = useState<number>(
        (Number(currentlyPlaying?.progress_ms) /
            Number(currentlyPlaying?.item?.duration_ms)) *
        100
    );

    const repeats: {
        [key: string]: string
    } = {
        'off': Repeat,
        'track': RepeatOne,
        'context': RepeatOn
    }
    const dispatch = useAppDispatch();

    const [duration, setDuration] = useState<number>(
        Number(currentlyPlaying?.progress_ms)
    );

    useEffect(() => {
        setPos(
            (Number(currentlyPlaying?.progress_ms) /
                Number(currentlyPlaying?.item?.duration_ms)) *
            100
        );

        setDuration(Number(currentlyPlaying?.progress_ms));
    }, [currentlyPlaying?.progress_ms, currentlyPlaying?.item?.duration_ms]);



    useEffect(() => {
        if (currentlyPlaying?.is_playing) {
            const timerInterval = setInterval(() => {
                setPos((duration / Number(currentlyPlaying?.item?.duration_ms)) * 100);

                setDuration((prev) => prev + 1000);
            }, 1000);

            if (duration >= Number(currentlyPlaying?.item?.duration_ms)) {
                dispatch(setUserControlActions({
                    userAction: 'Retrieve New One'
                }))
            }
            return () => clearInterval(timerInterval);
        }
    }, [
        duration,
        currentlyPlaying?.item?.duration_ms,
        currentlyPlaying?.progress_ms,
        currentlyPlaying?.is_playing,
    ]);

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
                            await toggleShuffleOnOff(accessToken, !shuffleState);
                            setShuffleState(prev => !prev)
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
                    <img alt="Skip Previous"  className={playerStyle['play-buttons']} src={SkipPrevious} width={30}></img>
                </button>
                <button
                    onClick={async () => {
                        if (currentlyPlaying?.is_playing) {
                            await PauseStreaming(accessToken);
                            dispatch(setUserControlActions({
                                userAction: 'Pause Streaming'
                            }))
                        } else {
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
                        src={currentlyPlaying?.is_playing ? Pause : Play}
                        width={40}
                    ></img>
                </button>
                <button
                    onClick={() => {
                        const playNextSong = async () => {
                          await PlayNext(accessToken)
                        }

                        playNextSong()

                        dispatch(
                            setUserControlActions({
                                userAction: "Play Next Song",
                            })
                        );

                    }}
                >
                    <img alt="Skip Next"  className={playerStyle['play-buttons']} src={SkipNext} width={30}></img>
                </button>
                <button
                    onClick={async () => {
                        if (disallows?.toggling_repeat_context === true && !disallows.toggling_repeat_track) {
                            await setRepeatMode(accessToken, repeatState === 'track' ? 'off' : 'track');
                            setRepeatState(repeatState === 'track' ? 'off' : 'track')
                        } else if (disallows?.toggling_repeat_track === true && !disallows.toggling_repeat_context) {
                            await setRepeatMode(accessToken, repeatState === 'context' ? 'off' : 'context');
                            setRepeatState(repeatState === 'context' ? 'off' : 'context')
                        } else if (!disallows?.toggling_repeat_track && !disallows?.toggling_repeat_context) {
                            if (repeatState === 'off') {
                                await setRepeatMode(accessToken, 'context');
                                setRepeatState('context')
                            } else if (repeatState === 'context') {
                                await setRepeatMode(accessToken, 'track');
                                setRepeatState('track')
                            } else if (repeatState === 'track') {
                                await setRepeatMode(accessToken, 'off');
                                setRepeatState('off')
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

            <div className={playerStyle["duration"]}>
                <p>{millisecondsToMmSs(Number(duration))}</p>

                <input
                    style={{
                        background: `linear-gradient(to right, #1ed760 ${pos}%, #4d4d4d ${pos}%)`,
                    }}

                    onChange={async (e) => {
                        setPos(Number(e.target.value));
                        await SeekToPosition(accessToken, Math.round(Number(currentlyPlaying?.item?.duration_ms) * Number(e.target.value) / 100));
                        dispatch(setUserControlActions({
                            userAction: 'Seek To Position'
                        }))
                    }}
                    type="range"
                    value={String(pos)}
                    max={100}
                    min={0}
                />
                <p>{currentlyPlaying?.item?.duration_ms ? millisecondsToMmSs(Number(currentlyPlaying?.item?.duration_ms)) : '--:--'}</p>
            </div>
        </div>
    );
}

export default StreamController;
