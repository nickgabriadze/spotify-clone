import {Track} from "../../../../../../types/track.ts";
import allResultsStyle from "../allresults.module.css";
import PlayResumeStreaming from "../../../../../../api/player/playResumeStreaming.ts";
import {setUserControlActions} from "../../../../../../store/features/navigationSlice.ts";
import Play from "../../Playlists/icons/play.svg";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../../../store/hooks.ts";
import Pause from "../../Playlists/icons/pause.svg";
import PauseStreaming from "../../../../../../api/player/pauseStreaming.ts";

export function TopResult({topSong, accessToken}: { topSong: Track | undefined, accessToken: string }) {
    const [hoveringOver, setHoveringOver] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const currentlyPlaying = useAppSelector((state) => state.navigationReducer.currentlyPlayingSong);
    console.log(currentlyPlaying.songID === String(topSong?.id) && currentlyPlaying.isPlaying);

    return <div className={allResultsStyle['top-result-wrapper']}
                onMouseOver={() => setHoveringOver(true)}
                onMouseOut={() => setHoveringOver(false)}>
        <h2>Top Result</h2>
        <div className={allResultsStyle['top-track-box']}
        >
            <div><img src={topSong?.album.images[0]?.url} width={92} alt={"Track image"} height={92}></img></div>
            <div
                className={allResultsStyle['track-name']}>{Number(topSong?.name.length) > 19 ? topSong?.name.slice(0, 19).concat('...') : topSong?.name}</div>
            <div className={allResultsStyle['track-artist-type']}>
                <a>{topSong?.artists[0].name}</a>
                <p>{topSong?.type === 'track' ? 'Song' : topSong?.type}</p>
            </div>

        </div>

        {hoveringOver && (

            <button
                onClick={async () => {
                    if (!(currentlyPlaying.songID === String(topSong?.id))) {
                        await PlayResumeStreaming(accessToken, undefined, [String(topSong?.uri)]);
                        dispatch(
                            setUserControlActions({
                                userAction: "Play Track",
                            })
                        );
                    } else if (currentlyPlaying.isPlaying && currentlyPlaying.songID === String(topSong?.id)) {
                        await PauseStreaming(accessToken);
                        dispatch(
                            setUserControlActions({
                                userAction: "Pause Track",
                            })
                        );
                    } else if (!(currentlyPlaying.isPlaying) && currentlyPlaying.songID === String(topSong?.id)) {
                        await PlayResumeStreaming(accessToken);
                        dispatch(
                            setUserControlActions({
                                userAction: "Resume Track",
                            })
                        );
                    }
                }}
                className={allResultsStyle["track-hover-button"]}
            >
                {currentlyPlaying.songID === String(topSong?.id) && currentlyPlaying.isPlaying ?
                    <div><img src={Pause} width={30} height={30} alt={'Pause Button Image'}></img></div>
                    :
                    <div><img src={Play} width={50} height={50} alt={'Play Button Image'}></img></div>
                }
            </button>)
        }

    </div>

}

export default TopResult